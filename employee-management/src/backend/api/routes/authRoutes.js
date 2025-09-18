const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

// POST /api/auth/LoginEmail
router.post('/LoginEmail', authCtrl.loginEmail);

// POST /api/auth/ValidateAccessCode
router.post('/ValidateAccessCode', authCtrl.validateAccessCode);

module.exports = router;
