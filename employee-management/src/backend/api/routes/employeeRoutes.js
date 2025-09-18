const express = require('express');
const router = express.Router();
const empCtrl = require('../controllers/employeeController');

// POST /api/employee/CreateEmployee
router.post('/CreateEmployee', empCtrl.createEmployee);

// POST /api/employee/GetEmployee
router.post('/GetEmployee', empCtrl.getEmployee);

// POST /api/employee/DeleteEmployee
router.post('/DeleteEmployee', empCtrl.deleteEmployee);

module.exports = router;
