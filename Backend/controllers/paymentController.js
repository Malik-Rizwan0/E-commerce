const warpAsync = require("../utils/warpAsync.js")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ✅ Create Payment
exports.processPayment = warpAsync(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount, // in the smallest unit (e.g., 50000 = 500.00 PKR/USD/INR)
    currency: "usd", // ⚠️ change "inr" → "usd" for testing
    metadata: { company: "Ecommerce" },
  });

  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret,
  });
});

// ✅ Send Public API Key (for frontend)
exports.sendStripeApiKey = warpAsync(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
