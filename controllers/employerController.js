const Employer = require("../models/Employer");
const Job = require("../models/Job");
const Employee = require("../models/Employee");
const Application = require("../models/Application");
const path = require("path");
const fs = require("fs");

 exports.getProfile = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.userId).select(
      "-password"
    );
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.json(employer);
  } catch (error) {
    console.error("Get employer profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 exports.updateProfile = async (req, res) => {
  try {
    const { companyName, city } = req.body;

    const employer = await Employer.findById(req.user.userId);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

 
    if (companyName) employer.companyName = companyName;
    if (city) employer.city = city;

    await employer.save();

    res.json({
      message: "Profile updated successfully",
      employer: {
        id: employer._id,
        companyName: employer.companyName,
        email: employer.email,
        city: employer.city,
      },
    });
  } catch (error) {
    console.error("Update employer profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 
exports.postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requiredProgrammingLanguages,
      experienceLevel,
      location,
    } = req.body;

    const job = new Job({
      employer: req.user.userId,
      title,
      description,
      requiredProgrammingLanguages,
      experienceLevel,
      location,
    });

    await job.save();

    res.status(201).json({
      message: "Job posted successfully",
      job: {
        id: job._id,
        title: job.title,
        location: job.location,
        experienceLevel: job.experienceLevel,
        isActive: job.isActive,
      },
    });
  } catch (error) {
    console.error("Post job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 
exports.getMyJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = { employer: req.user.userId };
    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;

    const jobs = await Job.find(query)
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
    console.error("Get my jobs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
 
exports.updateJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const updateData = req.body;

    const job = await Job.findOne({ _id: jobId, employer: req.user.userId });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

  
    Object.keys(updateData).forEach((key) => {
      if (key !== "employer" && key !== "_id") {
        job[key] = updateData[key];
      }
    });

    await job.save();

    res.json({
      message: "Job updated successfully",
      job: {
        id: job._id,
        title: job.title,
        location: job.location,
        experienceLevel: job.experienceLevel,
        isActive: job.isActive,
      },
    });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 
exports.toggleJobStatus = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findOne({ _id: jobId, employer: req.user.userId });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.json({
      message: `Job ${job.isActive ? "activated" : "deactivated"} successfully`,
      isActive: job.isActive,
    });
  } catch (error) {
    console.error("Toggle job status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 
exports.searchEmployees = async (req, res) => {
  try {
    const {
      programmingLanguages,
      city,
      experienceLevel,
      bioText,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (programmingLanguages) {
      query.programmingLanguages = {
        $in: programmingLanguages.split(","),
      };
    }

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (bioText) {
      query.biography = { $regex: bioText, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const employees = await Employee.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Employee.countDocuments(query);

     const employeeIds = employees.map((emp) => emp._id);
    await Employee.updateMany(
      { _id: { $in: employeeIds } },
      { $inc: { profileViews: 1 } }
    );

    res.json({
      employees,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalEmployees: total,
        hasNext: skip + employees.length < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Search employees error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
 
exports.getEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    const employee = await Employee.findById(employeeId).select("-password");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

   
    await Employee.findByIdAndUpdate(employeeId, { $inc: { profileViews: 1 } });

    res.json(employee);
  } catch (error) {
    console.error("Get employee profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
 
exports.getApplications = async (req, res) => {
  try {
    const { jobId, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = { employer: req.user.userId };
    if (jobId) query.job = jobId;
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate(
        "employee",
        "name email city experienceLevel programmingLanguages"
      )
      .populate("job", "title location")
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

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

 
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, employerNotes, interviewDate, interviewLocation } =
      req.body;
    const applicationId = req.params.applicationId;

    const application = await Application.findOne({
      _id: applicationId,
      employer: req.user.userId,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

   
    application.status = status;
    if (employerNotes) application.employerNotes = employerNotes;
    if (interviewDate) application.interviewDate = new Date(interviewDate);
    if (interviewLocation) application.interviewLocation = interviewLocation;
    application.reviewedAt = new Date();

    await application.save();

    res.json({
      message: "Application status updated successfully",
      application: {
        id: application._id,
        status: application.status,
        reviewedAt: application.reviewedAt,
      },
    });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 
exports.getEmployerStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ employer: req.user.userId });
    const activeJobs = await Job.countDocuments({
      employer: req.user.userId,
      isActive: true,
    });

    const totalApplications = await Application.countDocuments({
      employer: req.user.userId,
    });

    const applicationsByStatus = await Application.aggregate([
      { $match: { employer: req.user.userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusCounts = {};
    applicationsByStatus.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    res.json({
      totalJobs,
      activeJobs,
      totalApplications,
      applicationsByStatus: statusCounts,
    });
  } catch (error) {
    console.error("Get employer stats error:", error);
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
