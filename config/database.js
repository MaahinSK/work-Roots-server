const mongoose = require('mongoose');

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    // Don't exit the process in serverless/Vercel environment, just log
    // throw error; // Removed to prevent app crash on startup
  }
};

module.exports = connectDB;