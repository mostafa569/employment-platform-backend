const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const Employer = require("../models/Employer");

 
exports.registerEmployee = async (req, res) => {
  try {
    const {
      nationalId,
      name,
      city,
      email,
      password,
      biography,
      programmingLanguages,
      experienceLevel,
    } = req.body;


    const existingEmployee = await Employee.findOne({
      $or: [{ email }, { nationalId }],
    });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee with this email or national ID already exists",
      });
    }

     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

     const employee = new Employee({
      nationalId,
      name,
      city,
      email,
      password: hashedPassword,
      biography,
      programmingLanguages,
      experienceLevel,
    });

    await employee.save();

     const token = jwt.sign(
      { userId: employee._id, userType: "employee" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Employee registered successfully",
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        city: employee.city,
        experienceLevel: employee.experienceLevel,
      },
    });
  } catch (error) {
    console.error("Employee registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 exports.registerEmployer = async (req, res) => {
  try {
    const { companyName, email, password, city } = req.body;

      const existingEmployer = await Employer.findOne({ email });

    if (existingEmployer) {
      return res.status(400).json({
        message: "Employer with this email already exists",
      });
    }

     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

     const employer = new Employer({
      companyName,
      email,
      password: hashedPassword,
      city,
    });

    await employer.save();

    
    const token = jwt.sign(
      { userId: employer._id, userType: "employer" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Employer registered successfully",
      token,
      employer: {
        id: employer._id,
        companyName: employer.companyName,
        email: employer.email,
        city: employer.city,
      },
    });
  } catch (error) {
    console.error("Employer registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 
exports.loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

     const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
 
    const token = jwt.sign(
      { userId: employee._id, userType: "employee" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        city: employee.city,
        experienceLevel: employee.experienceLevel,
      },
    });
  } catch (error) {
    console.error("Employee login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginEmployer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employer = await Employer.findOne({ email });
    if (!employer) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

     
    const token = jwt.sign(
      { userId: employer._id, userType: "employer" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      employer: {
        id: employer._id,
        companyName: employer.companyName,
        email: employer.email,
        city: employer.city,
      },
    });
  } catch (error) {
    console.error("Employer login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
