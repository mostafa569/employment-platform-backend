const Employee = require("../models/Employee");
const Job = require("../models/Job");
const Application = require("../models/Application");
const path = require("path");
const fs = require("fs");

exports.getProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.userId).select(
      "-password"
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, city, biography, programmingLanguages, experienceLevel } =
      req.body;

    const employee = await Employee.findById(req.user.userId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (name) employee.name = name;
    if (city) employee.city = city;
    if (biography) employee.biography = biography;
    if (programmingLanguages)
      employee.programmingLanguages = programmingLanguages;
    if (experienceLevel) employee.experienceLevel = experienceLevel;

    await employee.save();

    res.json({
      message: "Profile updated successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        city: employee.city,
        biography: employee.biography,
        programmingLanguages: employee.programmingLanguages,
        experienceLevel: employee.experienceLevel,
        profileViews: employee.profileViews,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchJobs = async (req, res) => {
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
    console.error("Search jobs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getJobDetails = async (req, res) => {
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
};

exports.applyForJob = async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Job not found or inactive" });
    }

    const existingApplication = await Application.findOne({
      employee: req.user.userId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    const applicationData = {
      employee: req.user.userId,
      job: jobId,
      employer: job.employer,
      coverLetter,
    };

    if (req.file) {
      applicationData.cv = {
        filename: req.file.filename,
        path: req.file.path,
        originalName: req.file.originalname,
      };
    }

    const application = new Application(applicationData);

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application: {
        id: application._id,
        status: application.status,
        appliedAt: application.appliedAt,
        hasCV: !!application.cv,
      },
    });
  } catch (error) {
    console.error("Apply for job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const applications = await Application.find({ employee: req.user.userId })
      .populate("job", "title location salary jobType isRemote")
      .populate("employer", "companyName")
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments({
      employee: req.user.userId,
    });

    res.json({
      applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalApplications: total,
        hasNext: skip + applications.length < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRecommendedJobs = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.userId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const query = {
      isActive: true,
      requiredProgrammingLanguages: { $in: employee.programmingLanguages },
      experienceLevel: employee.experienceLevel,
    };

    const recommendedJobs = await Job.find(query)
      .populate("employer", "companyName city industry")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(recommendedJobs);
  } catch (error) {
    console.error("Get recommended jobs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfileStats = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.userId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const totalApplications = await Application.countDocuments({
      employee: req.user.userId,
    });

    const applicationsByStatus = await Application.aggregate([
      { $match: { employee: employee._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusCounts = {};
    applicationsByStatus.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    res.json({
      profileViews: employee.profileViews,
      totalApplications,
      applicationsByStatus: statusCounts,
      programmingLanguages: employee.programmingLanguages,
      experienceLevel: employee.experienceLevel,
    });
  } catch (error) {
    console.error("Get profile stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.downloadCV = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    const application = await Application.findById(applicationId)
      .populate("employee", "name")
      .populate("employer", "companyName");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (
      req.user.userType === "employee" &&
      application.employee._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (
      req.user.userType === "employer" &&
      application.employer._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!application.cv || !application.cv.path) {
      return res.status(404).json({ message: "CV file not found" });
    }

    const filePath = path.join(__dirname, "..", application.cv.path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "CV file not found on server" });
    }

    res.download(
      filePath,
      application.cv.originalName || application.cv.filename
    );
  } catch (error) {
    console.error("Download CV error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
