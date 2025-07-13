const express = require("express");
const router = express.Router();
const { authEmployer } = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  postJob,
  getMyJobs,
  updateJob,
  toggleJobStatus,
  searchEmployees,
  getEmployeeProfile,
  getApplications,
  updateApplicationStatus,
  getEmployerStats,
  downloadCV,
} = require("../controllers/employerController");
const {
  validateEmployerProfileUpdate,
  validateJobPosting,
  validateSearchQuery,
  validateApplicationStatusUpdate,
  validateJobId,
  validateApplicationId,
  validateEmployeeId,
} = require("../middleware/validation");

 router.get("/profile", authEmployer, getProfile);
router.put(
  "/profile",
  authEmployer,
  validateEmployerProfileUpdate,
  updateProfile
);
router.get("/stats", authEmployer, getEmployerStats);

 router.post("/jobs", authEmployer, validateJobPosting, postJob);
router.get("/jobs", authEmployer, getMyJobs);
router.put("/jobs/:jobId", authEmployer, validateJobId, updateJob);
router.patch(
  "/jobs/:jobId/toggle",
  authEmployer,
  validateJobId,
  toggleJobStatus
);


router.get(
  "/employees/search",
  authEmployer,
  validateSearchQuery,
  searchEmployees
);
router.get(
  "/employees/:employeeId",
  authEmployer,
  validateEmployeeId,
  getEmployeeProfile
);


router.get("/applications", authEmployer, getApplications);
router.put(
  "/applications/:applicationId/status",
  authEmployer,
  validateApplicationId,
  validateApplicationStatusUpdate,
  updateApplicationStatus
);
router.get(
  "/applications/:applicationId/cv",
  authEmployer,
  validateApplicationId,
  downloadCV
);

module.exports = router;
