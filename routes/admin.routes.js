const express = require("express");
const router = express.Router();

const { createAdmin, updateAdmin,getAdmin } = require("../controllers/admin.controllers");
// const { createUserValidator } = require("../utils/validator/userValidator");
const { authorisation } = require("../controllers/auth.controllers");

router.get("/", getAdmin);
router.post("/", createAdmin);
router.put("/:id", updateAdmin);

module.exports = router;
