const express = require("express");
const { loginEmail, validateAccessCode, setupAccount, loginEmployee } = require("../controllers/employeeController");

const router = express.Router();
router.post("/LoginEmail", loginEmail);
router.post("/ValidateAccessCode", validateAccessCode);
router.post("/SetupAccount", setupAccount);
router.post("/LoginEmployee", loginEmployee);

module.exports = router;
