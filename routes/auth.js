const express = require("express");
const router = express.Router();
const {
  registerEmployee,
  registerEmployer,
  loginEmployee,
  loginEmployer,
} = require("../controllers/authController");
const {
  validateEmployeeRegistration,
  validateEmployerRegistration,
  validateLogin,
} = require("../middleware/validation");

 
router.post(
  "/register/employee",
  validateEmployeeRegistration,
  registerEmployee
);
 
router.post(
  "/register/employer",
  validateEmployerRegistration,
  registerEmployer
);

 
router.post("/login/employee", validateLogin, loginEmployee);

 
router.post("/login/employer", validateLogin, loginEmployer);

module.exports = router;
