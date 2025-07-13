# Employment Platform Backend

A Node.js backend API for an employment platform designed specifically for software developers. The platform connects employees (developers) with employers (companies) through job postings and applications.

## Features

### Employee Features

- **Registration & Profile Management**: Register with personal information, programming languages, experience level, and biography
- **Job Search**: Search for jobs by programming languages, location, experience level, and other criteria
- **Job Applications**: Apply for jobs with cover letters
- **Profile Statistics**: View profile views and application status
- **Recommended Jobs**: Get job recommendations based on skills and experience

### Employer Features

- **Registration & Profile Management**: Register company information
- **Job Posting**: Create and manage job postings with detailed requirements
- **Employee Search**: Search for employees by programming languages, location, experience level, and bio text
- **Application Management**: Review and manage job applications with status updates
- **Statistics Dashboard**: View job and application statistics

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **File Upload**: multer
 

## Project Structure

```
├── server.js                 # Main server file
├── package.json             # Dependencies and scripts
├── env.example             # Environment variables template
├── models/                 # Database models
│   ├── Employee.js         # Employee model
│   ├── Employer.js         # Employer model
│   ├── Job.js             # Job model
│   └── Application.js      # Application model
├── controllers/            # Business logic
│   ├── authController.js   # Authentication logic
│   ├── employeeController.js # Employee operations
│   └── employerController.js # Employer operations
├── routes/                 # API routes
│   ├── auth.js            # Authentication routes
│   ├── employees.js       # Employee routes
│   ├── employers.js       # Employer routes
│   ├── jobs.js           # Job routes
│   └── applications.js    # Application routes
└── middleware/            # Middleware functions
    └── auth.js           # Authentication middleware
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd employment-platform-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your configuration:

   - Set your MongoDB connection string
   - Generate a secure JWT secret
   - Configure email settings (optional)

4. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## API Documentation

### Authentication Endpoints

#### Employee Registration

```
POST /api/auth/register/employee
Content-Type: application/json

{
  "nationalId": "123456789",
  "name": "John Doe",
  "city": "New York",
  "email": "john@example.com",
  "password": "password123",
  "biography": "Experienced software developer...",
  "programmingLanguages": ["JavaScript", "Python", "React"],
  "experienceLevel": "Senior"
}
```

#### Employer Registration

```
POST /api/auth/register/employer
Content-Type: application/json

{
  "companyName": "Tech Corp",
  "email": "hr@techcorp.com",
  "password": "password123",
  "city": "San Francisco",
  "industry": "Technology",
  "companySize": "Medium",
  "description": "Leading tech company...",
  "website": "https://techcorp.com"
}
```

#### Login

```
POST /api/auth/login/employee
POST /api/auth/login/employer
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Employee Endpoints

#### Get Profile

```
GET /api/employees/profile
Authorization: Bearer <token>
```

#### Update Profile

```
PUT /api/employees/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "city": "Updated City",
  "biography": "Updated bio...",
  "programmingLanguages": ["JavaScript", "TypeScript"],
  "experienceLevel": "Senior"
}
```

#### Search Jobs

```
GET /api/employees/jobs/search?programmingLanguages=JavaScript,React&location=New York&experienceLevel=Senior&page=1&limit=10
Authorization: Bearer <token>
```

#### Apply for Job

```
POST /api/employees/jobs/:jobId/apply
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- coverLetter: "I am interested in this position..."
- cv: [PDF/DOC/DOCX file] (optional)
```

#### Get Recommended Jobs

```
GET /api/employees/jobs/recommended
Authorization: Bearer <token>
```

#### Get Profile Statistics

```
GET /api/employees/profile/stats
Authorization: Bearer <token>
```

### Employer Endpoints

#### Post Job

```
POST /api/employers/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior JavaScript Developer",
  "description": "We are looking for...",
  "requirements": "5+ years experience...",
  "requiredProgrammingLanguages": ["JavaScript", "React", "Node.js"],
  "experienceLevel": "Senior",
  "location": "New York",
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "jobType": "Full-time",
  "isRemote": false,
  "applicationDeadline": "2024-12-31"
}
```

#### Search Employees

```
GET /api/employers/employees/search?programmingLanguages=JavaScript,React&city=New York&experienceLevel=Senior&bioText=React&page=1&limit=10
Authorization: Bearer <token>
```

#### Update Application Status

```
PUT /api/employers/applications/:applicationId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Shortlisted",
  "employerNotes": "Strong candidate...",
  "interviewDate": "2024-01-15T10:00:00Z",
  "interviewLocation": "Office or Zoom"
}
```

### Public Job Endpoints

#### Get All Jobs

```
GET /api/jobs?programmingLanguages=JavaScript&location=New York&experienceLevel=Senior&page=1&limit=10
```

#### Get Job Details

```
GET /api/jobs/:jobId
```

#### Download CV

```
GET /api/employees/applications/:applicationId/cv
GET /api/employers/applications/:applicationId/cv
Authorization: Bearer <token>
```

## Database Models

### Employee Model

- `nationalId`: Unique national ID
- `name`: Full name
- `city`: City location
- `email`: Email address (unique)
- `password`: Hashed password
- `biography`: Personal description
- `programmingLanguages`: Array of known languages
- `experienceLevel`: Junior, Mid, or Senior
- `profileViews`: Number of profile views
- `isActive`: Account status

### Employer Model

- `companyName`: Company name
- `email`: Email address (unique)
- `password`: Hashed password
- `city`: Company location
- `industry`: Industry type
- `companySize`: Startup, Small, Medium, Large
- `description`: Company description
- `website`: Company website

### Job Model

- `employer`: Reference to employer
- `title`: Job title
- `description`: Job description
- `requirements`: Job requirements
- `requiredProgrammingLanguages`: Required skills
- `experienceLevel`: Required experience level
- `location`: Job location
- `salary`: Min/max salary with currency
- `jobType`: Full-time, Part-time, Contract, Internship
- `isRemote`: Remote work option
- `isActive`: Job status
- `applicationDeadline`: Application deadline

### Application Model

- `employee`: Reference to employee
- `job`: Reference to job
- `employer`: Reference to employer
- `status`: Application status (Pending, Under Review, Shortlisted, Interview Scheduled, Accepted, Rejected)
- `coverLetter`: Application cover letter
- `resume`: Resume file information
- `appliedAt`: Application date
- `reviewedAt`: Review date
- `employerNotes`: Employer notes
- `interviewDate`: Interview date
- `interviewLocation`: Interview location
- `isWithdrawn`: Withdrawal status

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Request validation using express-validator
- **CORS**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling middleware

## Search Functionality

### Employee Search (by Employers)

- **Programming Languages**: Search by specific programming languages
- **Location**: Search by city
- **Experience Level**: Filter by Junior, Mid, or Senior
- **Bio Text**: Search within employee biographies

### Job Search (by Employees)

- **Programming Languages**: Search by required skills
- **Location**: Search by job location
- **Experience Level**: Filter by required experience
- **Job Type**: Filter by employment type
- **Remote Work**: Filter by remote work availability


This project is licensed under the MIT License.
