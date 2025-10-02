const dotenv = require('dotenv');
dotenv.config({path : "config/config.env"});
const app = require('./app');
const path = require('path');
const connectDB = require('./config/database');

connectDB();

const PORT = process.env.PORT;

// ✅ Store the server instance
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// 🔴 Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🛑 Unhandled Rejection at:', promise, 'Reason:', reason);
  
  // Optional: Send to error tracking service
  // trackError(reason);
  
  // Graceful shutdown
  if (server) {
    server.close(() => {
      console.log('🔴 Server closed due to unhandled rejection');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});