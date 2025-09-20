const express = require("express");
const router = express.Router();
const ownerCtrl = require("../controllers/ownerController");

// Auth owner
router.post('/LoginEmail', ownerCtrl.loginEmail);
router.post('/CreateNewAccessCode', ownerCtrl.createNewAccessCode);
router.post('/ValidateAccessCode', ownerCtrl.validateAccessCode);

// CRUD employees
router.post("/CreateEmployee", ownerCtrl.createEmployee);
router.get("/GetEmployees", ownerCtrl.listEmployees);
router.post("/GetEmployee", ownerCtrl.getEmployee);
router.put("/UpdateEmployee", ownerCtrl.updateEmployee);
router.delete("/DeleteEmployee", ownerCtrl.deleteEmployee);

module.exports = router;
