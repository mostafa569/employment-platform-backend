const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

 
dotenv.config();

const app = express();

 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/employment-platform",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

 
app.use("/api/auth", require("./routes/auth"));
app.use("/api/employees", require("./routes/employees"));
app.use("/api/employers", require("./routes/employers"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));

 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

 
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
 

module.exports = app;
