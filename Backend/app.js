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
  "https://rixi-store.netlify.app", // ✅ use literal string instead of relying on env
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true, // ✅ Required for cookies
  })
);

//  routes 
app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', payment);
app.get("/uptime", (req, res) => {
  res.status(200).send("OK");
});

app.use(errorHandler)
module.exports = app;
