const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://maahin810_db_user:rqBYj5ku0XilwPUz@ejp-work-roots.uptgvru.mongodb.net/work-roots?retryWrites=true&w=majority&appName=ejp-work-roots');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;