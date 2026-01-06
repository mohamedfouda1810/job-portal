# 🚀 Job Portal Backend API

![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Express.js](https://img.shields.io/badge/Express.js-4.x-white)
![REST API](https://img.shields.io/badge/Architecture-RESTful-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

A robust and scalable backend service for a Job Portal application. Built with **Node.js** and **Express.js**, this RESTful API handles user authentication, job posting management, application tracking, and company profiling with secure authorization protocols.

---

## ✨ Key Features

* **🔐 Authentication & Security:** Secure user registration and login using **JWT (JSON Web Tokens)** and **Bcrypt** for password hashing.
* **💼 Job Management:** Complete CRUD operations for creating, updating, deleting, and searching job listings.
* **🏢 Company Profiles:** Management of company details, logos, and posted jobs.
* **📄 Application System:** Functionality for candidates to apply for jobs and for recruiters to track applications.
* **🔍 Advanced Search:** Filtering capabilities for jobs based on category, location, and salary range.
* **🛡️ Role-Based Access Control (RBAC):** Distinct permissions for **Admin**, **Recruiter**, and **Job Seeker** roles.
* **📁 File Uploads:** Support for resume (CV) and company logo uploads (using Multer/Cloudinary).

---

## 🛠️ Technology Stack

* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Database:** MongoDB (via Mongoose) *[Or update to SQL/PostgreSQL if applicable]*
* **Authentication:** JWT & Passport.js (optional)
* **Validation:** Joi / Express-Validator
* **Utilities:** Morgan (Logging), Dotenv (Config), Cors

---

## 📂 Project Structure

```text
├── config/             # Database connection & environment setup
├── controllers/        # Request logic & response handling
├── models/             # Database Schemas (User, Job, Application)
├── routes/             # API Endpoints (Express Router)
├── middlewares/        # Auth checks, Error handling, Validation
├── utils/              # Helper functions (Email, File Upload)
├── app.js              # Express App setup
└── server.js           # Entry point
