const express = require("express");

const { signup, login } = require("../controllers/authController");
const { createUserValidator } = require("./../validators/userValidators");
const router = express.Router();

router.route("/signup").post(createUserValidator, signup);
router.route("/login").post(login);

module.exports = router;
