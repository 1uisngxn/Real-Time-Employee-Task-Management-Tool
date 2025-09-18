const express = require('express');
const router = express.Router();
const ownerCtrl = require('../controllers/ownerController');

// POST /api/owner/CreateNewAccessCode
router.post('/CreateNewAccessCode', ownerCtrl.createNewAccessCode);

// POST /api/owner/ValidateAccessCode
router.post('/ValidateAccessCode', ownerCtrl.validateAccessCode);

module.exports = router;
