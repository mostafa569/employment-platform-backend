const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Accepted",
        "Rejected",
      ],
      default: "Pending",
    },
    coverLetter: {
      type: String,
      maxlength: 2000,
    },
    cv: {
      filename: String,
      path: String,
      originalName: String,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    employerNotes: {
      type: String,
      maxlength: 1000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

 
applicationSchema.index({ employee: 1, job: 1 }, { unique: true });
applicationSchema.index({ employer: 1, status: 1 });
applicationSchema.index({ employee: 1, status: 1 });

module.exports = mongoose.model("Application", applicationSchema);
