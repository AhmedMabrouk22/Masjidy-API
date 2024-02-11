const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Email = require("../config/email");

const hashPassword = async (password) => await bcrypt.hash(password, 12);
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

const createRefreshToken = (user_id, token) => {
  const d = parseInt(process.env.JWT_REFRESH_EXPIRES_IN, 10);
  let date = new Date(Date.now() + d * 24 * 60 * 60 * 1000);
  return {
    user_id,
    token,
    expireAt: date,
  };
};

const generateRandomCode = () =>
  Math.floor(Math.random() * 900000 + 100000).toString();

const hashResetCode = (resetCode) =>
  crypto.createHash("sha256").update(resetCode).digest("hex");

const sendMail = async (user_reset_id, user, resetCode) => {
  try {
    const email = new Email(
      {
        firstName: user.first_name,
        email: user.email,
      },
      {
        code: resetCode,
      }
    );
    await email.sendResetPassword();
  } catch (error) {
    await User_Auth.destroy({ where: { id: user_reset_id } });
    throw error;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  createRefreshToken,
  generateRandomCode,
  hashResetCode,
  sendMail,
};
