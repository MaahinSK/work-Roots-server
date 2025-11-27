const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables at the very top
require('dotenv').config();

// Route files
const auth = require('./routes/auth');
const skills = require('./routes/skills');
const hires = require('./routes/hires');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://work-roots-client.vercel.app'
  ],
  credentials: true
}));
app.use('/api/skills', skills);
app.use('/api/hires', hires);

// Basic route for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5002; // Use 5002 as fallback

console.log('Attempting to start server on port:', PORT);

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 API available at: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});