const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    nationalId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    biography: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    programmingLanguages: [
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
    profileViews: {
      type: Number,
      default: 0,
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

employeeSchema.index({
  programmingLanguages: 1,
  city: 1,
  experienceLevel: 1,
});

employeeSchema.index({ biography: "text" });

const Employee = mongoose.model("Employee", employeeSchema);

// const employees = [];
// for (let i = 1; i <= 50; i++) {
//   employees.push({
//     nationalId: `1234567890${i}`,
//     name: `Employee ${i}`,
//     city: `City ${i % 5}`,
//     email: `employee${i}@test.com`,
//     password: `hashed_password_${i}`,
//     biography: `This is employee number ${i}. A skilled developer with experience in multiple programming languages.`,
//     programmingLanguages: [
//       "JavaScript",
//       "Python",
//       "C++",
//       "Java",
//       "React",
//     ].slice(0, (i % 3) + 1),
//     experienceLevel: ["Junior", "Mid", "Senior"][i % 3],
//     profileViews: Math.floor(Math.random() * 100),
//   });
// }
// Employee.insertMany(employees);

module.exports = Employee;
