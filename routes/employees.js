const express = require("express");
const router = express.Router();
const { authEmployee } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getProfile,
  updateProfile,
  searchJobs,
  getJobDetails,
  applyForJob,
  getMyApplications,
  getRecommendedJobs,
  getProfileStats,
  downloadCV,
} = require("../controllers/employeeController");
const {
  validateEmployeeProfileUpdate,
  validateJobApplication,
  validateJobSearch,
  validateJobId,
  validateApplicationId,
} = require("../middleware/validation");

router.get("/profile", authEmployee, getProfile);
router.put(
  "/profile",
  authEmployee,
  validateEmployeeProfileUpdate,
  updateProfile
);
router.get("/profile/stats", authEmployee, getProfileStats);

router.get("/jobs/search", authEmployee, validateJobSearch, searchJobs);
router.get("/jobs/:jobId", authEmployee, validateJobId, getJobDetails);
router.post(
  "/jobs/:jobId/apply",
  authEmployee,
  upload.single("cv"),
  validateJobApplication,
  applyForJob
);
router.get("/jobs/recommended", authEmployee, getRecommendedJobs);

router.get("/applications", authEmployee, getMyApplications);
router.get(
  "/applications/:applicationId/cv",
  authEmployee,
  validateApplicationId,
  downloadCV
);

module.exports = router;
