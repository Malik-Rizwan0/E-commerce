const express = require('express');
const app = express();
const errorHandler = require('./middlewares/errorMiddleware');
const cookieParser = require('cookie-parser');


// Importing routes
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRouter');
const payment = require('./routes/paymentRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
// app.use(fileUpload({ useTempFiles: true }));

// Backend/app.js (or server.js if you don't separate)
const cors = require("cors");




const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // e.g. https://rixi-store.netlify.app
];

// ✅ Proper callback with origin inside
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Allow Postman, curl, etc.
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true
}));

//  routes 
app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', payment);


app.use(errorHandler)
module.exports = app;