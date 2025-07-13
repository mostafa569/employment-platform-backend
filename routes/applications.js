const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const Application = require("../models/Application");
const { validateApplicationId } = require("../middleware/validation");

 router.get("/:applicationId", auth, validateApplicationId, async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate(
        "employee",
        "name email city experienceLevel programmingLanguages"
      )
      .populate("job", "title location salary jobType")
      .populate("employer", "companyName");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

     if (
      req.user.userType === "employee" &&
      application.employee.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (
      req.user.userType === "employer" &&
      application.employer.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(application);
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

 router.patch(
  "/:applicationId/withdraw",
  auth,
  validateApplicationId,
  async (req, res) => {
    try {
      if (req.user.userType !== "employee") {
        return res
          .status(403)
          .json({ message: "Only employees can withdraw applications" });
      }

      const application = await Application.findOne({
        _id: req.params.applicationId,
        employee: req.user.userId,
      });

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      if (application.isWithdrawn) {
        return res
          .status(400)
          .json({ message: "Application already withdrawn" });
      }

      application.isWithdrawn = true;
      application.withdrawnAt = new Date();
      await application.save();

      res.json({
        message: "Application withdrawn successfully",
        application: {
          id: application._id,
          isWithdrawn: application.isWithdrawn,
          withdrawnAt: application.withdrawnAt,
        },
      });
    } catch (error) {
      console.error("Withdraw application error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
