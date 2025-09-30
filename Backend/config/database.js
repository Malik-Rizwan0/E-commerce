const mongoose = require('mongoose');

const dbUrl = process.env.DB_URL;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbUrl);

    console.log("Database connected successfully:", conn.connection.host);
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
