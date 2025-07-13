const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    requiredProgrammingLanguages: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    experienceLevel: {
      type: String,
      enum: ["Junior", "Mid", "Senior"],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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


jobSchema.index({
  requiredProgrammingLanguages: 1,
  location: 1,
  experienceLevel: 1,
});

 jobSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Job", jobSchema);
