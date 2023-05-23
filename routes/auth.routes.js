const express = require("express");
const router = express.Router();

const { login } = require("../controllers/auth.controllers");

// const { loginValidator } = require("../utils/validator/authValidator");

router.post("/login", login);

module.exports = router;
