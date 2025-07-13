const { body, param, query, validationResult } = require("express-validator");

 
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

 
const validateEmployeeRegistration = [
  body("nationalId")
    .notEmpty()
    .withMessage("National ID is required")
    .isLength({ min: 5, max: 20 })
    .withMessage("National ID must be between 5 and 20 characters")
    .matches(/^[0-9]+$/)
    .withMessage("National ID must contain only numbers"),

  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name must contain only letters and spaces"),

  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("City must contain only letters and spaces"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be between 6 and 100 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

  body("biography")
    .notEmpty()
    .withMessage("Biography is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Biography must be between 10 and 1000 characters"),

  body("programmingLanguages")
    .isArray({ min: 1 })
    .withMessage("At least one programming language is required")
    .custom((languages) => {
      if (!Array.isArray(languages) || languages.length === 0) {
        throw new Error(
          "Programming languages must be an array with at least one language"
        );
      }
      for (let lang of languages) {
        if (typeof lang !== "string" || lang.trim().length === 0) {
          throw new Error(
            "Each programming language must be a non-empty string"
          );
        }
      }
      return true;
    }),

  body("experienceLevel")
    .notEmpty()
    .withMessage("Experience level is required")
    .isIn(["Junior", "Mid", "Senior"])
    .withMessage("Experience level must be Junior, Mid, or Senior"),

  handleValidationErrors,
];

 
const validateEmployerRegistration = [
  body("companyName")
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be between 6 and 100 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("City must contain only letters and spaces"),

  handleValidationErrors,
];

 
const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];
 
const validateEmployeeProfileUpdate = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name must contain only letters and spaces"),

  body("city")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("City must contain only letters and spaces"),

  body("biography")
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Biography must be between 10 and 1000 characters"),

  body("programmingLanguages")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one programming language is required")
    .custom((languages) => {
      if (!Array.isArray(languages) || languages.length === 0) {
        throw new Error(
          "Programming languages must be an array with at least one language"
        );
      }
      for (let lang of languages) {
        if (typeof lang !== "string" || lang.trim().length === 0) {
          throw new Error(
            "Each programming language must be a non-empty string"
          );
        }
      }
      return true;
    }),

  body("experienceLevel")
    .optional()
    .isIn(["Junior", "Mid", "Senior"])
    .withMessage("Experience level must be Junior, Mid, or Senior"),

  handleValidationErrors,
];

 
const validateEmployerProfileUpdate = [
  body("companyName")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),

  body("city")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("City must contain only letters and spaces"),

  handleValidationErrors,
];

 
const validateJobPosting = [
  body("title")
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Job title must be between 5 and 100 characters"),

  body("description")
    .notEmpty()
    .withMessage("Job description is required")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Job description must be between 20 and 2000 characters"),

  body("requiredProgrammingLanguages")
    .isArray({ min: 1 })
    .withMessage("At least one programming language is required")
    .custom((languages) => {
      if (!Array.isArray(languages) || languages.length === 0) {
        throw new Error(
          "Required programming languages must be an array with at least one language"
        );
      }
      for (let lang of languages) {
        if (typeof lang !== "string" || lang.trim().length === 0) {
          throw new Error(
            "Each programming language must be a non-empty string"
          );
        }
      }
      return true;
    }),

  body("experienceLevel")
    .notEmpty()
    .withMessage("Experience level is required")
    .isIn(["Junior", "Mid", "Senior"])
    .withMessage("Experience level must be Junior, Mid, or Senior"),

  body("location")
    .notEmpty()
    .withMessage("Job location is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),

  handleValidationErrors,
];
 
const validateJobApplication = [
  body("coverLetter")
    .optional()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Cover letter must be between 10 and 2000 characters"),

  handleValidationErrors,
];

 const validateApplicationStatusUpdate = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      "Pending",
      "Under Review",
      "Shortlisted",
      "Interview Scheduled",
      "Accepted",
      "Rejected",
    ])
    .withMessage(
      "Status must be one of: Pending, Under Review, Shortlisted, Interview Scheduled, Accepted, Rejected"
    ),

  body("employerNotes")
    .optional()
    .isLength({ min: 5, max: 1000 })
    .withMessage("Employer notes must be between 5 and 1000 characters"),

  body("interviewDate")
    .optional()
    .isISO8601()
    .withMessage("Interview date must be a valid ISO 8601 date"),

  body("interviewLocation")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Interview location must be between 2 and 100 characters"),

  handleValidationErrors,
];

 const validateSearchQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("programmingLanguages")
    .optional()
    .isString()
    .withMessage("Programming languages must be a comma-separated string"),

  query("location")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Location must be between 2 and 50 characters"),

  query("experienceLevel")
    .optional()
    .isIn(["Junior", "Mid", "Senior"])
    .withMessage("Experience level must be Junior, Mid, or Senior"),

  query("bioText")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Bio text search must be between 2 and 100 characters"),

  handleValidationErrors,
];

 const validateJobSearch = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("programmingLanguages")
    .optional()
    .isString()
    .withMessage("Programming languages must be a comma-separated string"),

  query("location")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Location must be between 2 and 50 characters"),

  query("experienceLevel")
    .optional()
    .isIn(["Junior", "Mid", "Senior"])
    .withMessage("Experience level must be Junior, Mid, or Senior"),

  query("jobType")
    .optional()
    .isIn(["Full-time", "Part-time", "Contract", "Internship"])
    .withMessage(
      "Job type must be Full-time, Part-time, Contract, or Internship"
    ),

  query("isRemote")
    .optional()
    .isBoolean()
    .withMessage("isRemote must be true or false"),

  handleValidationErrors,
];

 const validateId = [
  param("id").isMongoId().withMessage("Invalid ID format"),

  handleValidationErrors,
];

const validateJobId = [
  param("jobId").isMongoId().withMessage("Invalid job ID format"),

  handleValidationErrors,
];

const validateApplicationId = [
  param("applicationId")
    .isMongoId()
    .withMessage("Invalid application ID format"),

  handleValidationErrors,
];

const validateEmployeeId = [
  param("employeeId").isMongoId().withMessage("Invalid employee ID format"),

  handleValidationErrors,
];

module.exports = {
  validateEmployeeRegistration,
  validateEmployerRegistration,
  validateLogin,
  validateEmployeeProfileUpdate,
  validateEmployerProfileUpdate,
  validateJobPosting,
  validateJobApplication,
  validateApplicationStatusUpdate,
  validateSearchQuery,
  validateJobSearch,
  validateId,
  validateJobId,
  validateApplicationId,
  validateEmployeeId,
};
