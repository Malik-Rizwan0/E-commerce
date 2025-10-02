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


if (!origin || allowedOrigins.includes(origin)) return cb(null, true);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.LOCAL_URL || "http://localhost:5173"
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
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