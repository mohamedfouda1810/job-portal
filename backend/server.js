require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const saved_jobRoutes = require('./routes/saved_jobRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; worker-src 'self' blob:; connect-src 'self' https://job-portal-meobpm0b9-mohamedfouda1810s-projects.vercel.app;"
  );
  next();
});

// Connect to Database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/save-jobs', saved_jobRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve React frontend
const frontendPath = path.join(__dirname, 'frontend-build');
app.use(express.static(frontendPath));

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'frontend-build', 'index.html'));
  } else {
    next();
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
