const { Op } = require("sequelize");

const sequelize = require("./../config/db");
const { User, User_Auth, RefreshToken } = require("./../models/index");
const AppError = require("./../config/error");
const logger = require("./../config/logger");
const authUtils = require("./../utils/authUtils");

/**
 * Create a new user in the database after checking if the user already exists, hashing the password, generating access and refresh tokens, and storing the refresh token in the database.
 *
 * @param {Object} user - The user object containing user information including email and password
 * @return {Promise<Object>} - A promise that resolves with the newly created user object
 */
exports.createUser = async (user) => {
  try {
    // check user is not exist
    const userExists = await User.findOne({ where: { email: user.email } });
    if (userExists) {
      throw new AppError(400, "User already exists", true);
    }

    // hash password
    const hashedPassword = await authUtils.hashPassword(user.password);
    user.password = hashedPassword;

    // create user
    const result = await sequelize.transaction(async (t) => {
      let newUser = await User.create(user, { transaction: t });

      // generate access and refresh token
      const access_token = authUtils.generateAccessToken({ id: newUser.id });
      const refresh_token = authUtils.generateRefreshToken({ id: newUser.id });
      newUser.dataValues.access_token = access_token;
      newUser.dataValues.refresh_token = refresh_token;

      // store refresh token in db
      token = authUtils.createRefreshToken(newUser.id, refresh_token);
      await RefreshToken.create(token, { transaction: t });

      delete newUser.dataValues["password"];
      return newUser;
    });
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Function to handle user login.
 *
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @return {Promise<object>} The user object with access and refresh tokens
 */
exports.login = async (email, password) => {
  try {
    // check if email and password is passed in request
    if (!email || !password) {
      throw new AppError(400, "Email and password are required", true);
    }
    // check if user exist or not
    let user = await User.findOne({ where: { email } });

    // compare password
    if (
      (user && !(await authUtils.comparePassword(password, user.password))) ||
      !user
    ) {
      throw new AppError(404, "Invalid email or password", true);
    }

    // generate access and refresh token
    const access_token = authUtils.generateAccessToken({ id: user.id });
    const refresh_token = authUtils.generateRefreshToken({ id: user.id });
    user.dataValues.access_token = access_token;
    user.dataValues.refresh_token = refresh_token;
    // add new refresh token (allow login on multiple devices)

    token = authUtils.createRefreshToken(user.id, refresh_token);
    await RefreshToken.create(token);

    delete user.dataValues["password"];
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves a user by their user ID.
 *
 * @param {number} user_id - The ID of the user to retrieve
 * @return {Promise<User>} The user object if found
 */
exports.getUser = async (user_id) => {
  try {
    const user = await User.findOne({
      where: { id: user_id },
      attributes: { exclude: ["password"] },
    });
    // delete user.dataValues["password"];
    if (!user) {
      throw new AppError(404, "User not found", true);
    }
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves all users excluding their passwords.
 *
 * @return {Array} The array of users.
 */
exports.getUsers = async (config) => {
  try {
    // Pagination
    const page = config.page * 1 || 1;
    const limit = config.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      offset: skip,
      limit: limit,
    });
    return users;
  } catch (error) {
    throw error;
  }
};

/**
 * Function to handle the process of resetting a user's password.
 *
 * @param {string} user_email - The email of the user requesting the password reset
 * @return {Promise} A promise that resolves when the password reset process is completed
 */
exports.forgetPassword = async (user_email) => {
  try {
    // Get user
    const user = await User.findOne({ where: { email: user_email } });
    if (!user) {
      throw new AppError(404, "User not found", true);
    }

    // Generate the random reset code
    const resetCode = authUtils.generateRandomCode();
    const hashedResetCode = authUtils.hashResetCode(resetCode);

    // Save reset code on user auth
    const userAuth = await User_Auth.create({
      user_id: user.id,
      reset_password_code: hashedResetCode,
      reset_code_expires_at: new Date(
        Date.now() + 30 * 60 * 1000
      ).toUTCString(),
      is_verified: false,
    });

    // send email to user
    await authUtils.sendMail(
      userAuth.dataValues.id,
      user.dataValues,
      resetCode
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Verifies the reset code for a user's password reset.
 *
 * @param {string} email - The email of the user
 * @param {string} code - The reset code to verify
 * @return {Promise<void>} A promise that resolves with no value upon successful verification
 */
exports.verifyResetCode = async (email, code) => {
  try {
    // get user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError(404, "User not found", true);
    }

    const hashedCode = authUtils.hashResetCode(code);
    // get user auth
    const userAuth = await User_Auth.findOne({
      where: {
        user_id: user.dataValues.id,
        reset_password_code: hashedCode,
        is_verified: false,
        reset_code_expires_at: { [Op.gte]: new Date(Date.now()).toUTCString() },
      },
    });
    if (!userAuth) {
      throw new AppError(400, "Invalid or expired reset code", true);
    }

    await userAuth.update(
      {
        is_verified: true,
        reset_password_code: null,
        reset_code_expires_at: null,
      },
      {
        where: {
          user_id: userAuth.dataValues.id,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Resets the user's password and updates the access and refresh tokens.
 *
 * @param {string} email - The email of the user
 * @param {string} password - The new password to be set
 * @return {Promise<object>} The updated user object with new access and refresh tokens
 */
exports.resetPassword = async (email, password) => {
  try {
    // get user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError(404, "User not found", true);
    }

    // check if user auth is verified
    const userAuth = await User_Auth.findOne({
      where: { user_id: user.dataValues.id, is_verified: true },
    });
    if (!userAuth) {
      throw new AppError(400, "User not verified", true);
    }

    // hash password
    const hashedPassword = await authUtils.hashPassword(password);
    user.password = hashedPassword;
    await user.save();

    // delete user auth
    await User_Auth.destroy({ where: { user_id: user.dataValues.id } });

    // delete all user refresh tokens
    await RefreshToken.destroy({ where: { user_id: user.dataValues.id } });

    // generate access and refresh token
    const access_token = authUtils.generateAccessToken({ id: user.id });
    const refresh_token = authUtils.generateRefreshToken({ id: user.id });
    user.dataValues.access_token = access_token;
    user.dataValues.refresh_token = refresh_token;

    // add new refresh token
    const token = authUtils.createRefreshToken(user.id, refresh_token);
    await RefreshToken.create(token);

    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Refreshes the access and refresh token using the provided refresh token and email.
 *
 * @param {string} refresh_token - The refresh token used to refresh the access and refresh token
 * @param {string} email - The email of the user
 * @return {object} An object containing the new access token and refresh token
 */
exports.refreshToken = async (refresh_token, email) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError(404, "User not found", true);
    }
    const user_id = user.dataValues.id;
    const refreshToken = await RefreshToken.findOne({
      where: { token: refresh_token, user_id: user_id },
    });
    if (!refreshToken) {
      throw new AppError(400, "Invalid refresh token", true);
    }

    // delete refresh token
    await refreshToken.destroy();

    // generate access and refresh token
    const access_token = authUtils.generateAccessToken({ id: user_id });
    const newRefreshToken = authUtils.generateRefreshToken({
      id: user_id,
    });

    // add new refresh token
    const token = authUtils.createRefreshToken(user_id, newRefreshToken);
    await RefreshToken.create(token);

    return {
      access_token,
      refresh_token: newRefreshToken,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a user with the given user ID.
 *
 * @param {number} user_id - The ID of the user to be deleted
 * @return {Promise} A promise that resolves when the user is successfully deleted, and rejects with an error if deletion fails
 */
exports.deleteUser = async (user_id) => {
  try {
    await User.destroy({ where: { id: user_id } });
  } catch (error) {
    throw error;
  }
};

/**
 * Updates the user type for a given user ID.
 *
 * @param {string} user_id - The ID of the user to update.
 * @param {string} type - The new type to assign to the user.
 * @return {Promise<void>} Promise that resolves once the user type is updated.
 */
exports.changeUserType = async (user_id, type) => {
  try {
    // check if user exists
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      throw new AppError(404, "User not found", true);
    }

    await User.update({ user_type: type }, { where: { id: user_id } });
  } catch (error) {
    throw error;
  }
};

exports.addAdmin = async (data) => {
  try {
    const userExists = await User.findOne({ where: { email: data.email } });
    if (userExists) {
      throw new AppError(400, "User already exists", true);
    }

    // hash password
    const hashedPassword = await authUtils.hashPassword(data.password);
    data.password = hashedPassword;

    await User.create(data);
  } catch (error) {
    throw error;
  }
};
