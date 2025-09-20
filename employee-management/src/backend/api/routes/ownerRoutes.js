const express = require("express");
const router = express.Router();
const ownerCtrl = require("../controllers/ownerController");

// POST /api/owner/CreateNewAccessCode
router.post('/CreateNewAccessCode', ownerCtrl.createNewAccessCode);

// POST /api/owner/ValidateAccessCode
router.post('/ValidateAccessCode', ownerCtrl.validateAccessCode);

// Owner quản lý employees
router.post("/CreateEmployee", ownerCtrl.createEmployee);
router.get("/GetEmployees", ownerCtrl.listEmployees);
router.post("/GetEmployee", ownerCtrl.getEmployee);
router.put("/UpdateEmployee", ownerCtrl.updateEmployee);
router.delete("/DeleteEmployee", ownerCtrl.deleteEmployee);

module.exports = router;
