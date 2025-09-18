const express = require("express");
const router = express.Router();
const empCtrl = require("../controllers/employeeController");

router.post("/CreateEmployee", empCtrl.createEmployee);
router.post("/GetEmployee", empCtrl.getEmployee);
router.get("/GetEmployees", empCtrl.listEmployees);
router.put("/UpdateEmployee", empCtrl.updateEmployee);
router.delete("/DeleteEmployee", empCtrl.deleteEmployee);

module.exports = router;
