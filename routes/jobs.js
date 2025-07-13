const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const {
  validateJobSearch,
  validateJobId,
} = require("../middleware/validation");

router.get("/", validateJobSearch, async (req, res) => {
  try {
    const {
      programmingLanguages,
      location,
      experienceLevel,
      jobType,
      isRemote,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    if (programmingLanguages) {
      query.requiredProgrammingLanguages = {
        $in: programmingLanguages.split(","),
      };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (isRemote !== undefined) {
      query.isRemote = isRemote === "true";
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate("employer", "companyName city industry")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalJobs: total,
        hasNext: skip + jobs.length < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:jobId", validateJobId, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate(
      "employer",
      "companyName city industry description website"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("Get job details error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
