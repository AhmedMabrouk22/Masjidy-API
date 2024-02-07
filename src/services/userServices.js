const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sequelize = require("./../config/db");
const User = require("./../models/userModel");
const User_Auth = require("./../models/user_auth");
const AppError = require("./../config/error");
const logger = require("./../config/logger");

const hashPassword = async (password) => await bcrypt.hashSync(password, 12);
const comparePassword = async (password, hash) =>
  await bcrypt.compare(password, hash);

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (data) => {
  return jwt.sign(data, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

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
    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;

    // create user
    const result = await sequelize.transaction(async (t) => {
      let newUser = await User.create(user, { transaction: t });

      // generate access and refresh token
      const access_token = generateAccessToken({ id: newUser.id });
      const refresh_token = generateRefreshToken({ id: newUser.id });
      newUser.dataValues.access_token = access_token;
      newUser.dataValues.refresh_token = refresh_token;

      // store refresh token in db
      await User_Auth.create(
        {
          user_id: newUser.id,
          refresh_token,
        },
        { transaction: t }
      );

      delete newUser.dataValues["password"];
      logger.info(`User with ID ${newUser.dataValues.id} created.`);
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
    if ((user && !(await comparePassword(password, user.password))) || !user) {
      throw new AppError(404, "Invalid email or password", true);
    }

    // generate access and refresh token
    const access_token = generateAccessToken({ id: user.id });
    const refresh_token = generateRefreshToken({ id: user.id });
    user.dataValues.access_token = access_token;
    user.dataValues.refresh_token = refresh_token;
    // add new refresh token (allow login on multiple devices)
    await User_Auth.create({
      user_id: user.id,
      refresh_token,
    });
    delete user.dataValues["password"];
    logger.info(`User with ID ${user.dataValues.id} logged in.`);
    return user;
  } catch (error) {
    throw error;
  }
};
