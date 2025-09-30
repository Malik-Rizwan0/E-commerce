const Order = require('../models/orderModel.js');
const ExpressError = require("../utils/ExpressError.js")
const warpAsync =  require('../utils/warpAsync.js');
const Product = require('../models/productModel.js');

exports.createOrder = warpAsync(async (req, res, next) => {
    const {  shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        createdAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        order
    });
});

// Get single order --- admin
exports.getSingleOrder = warpAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        return next(new ExpressError(404 , 'Order not found with this ID'));
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Loggedin user orders
exports.myOrders = warpAsync(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    });
});

// Admin: Get all orders
exports.getAllOrders = warpAsync(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});
// Admin: Update order status
exports.updateOrder = warpAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ExpressError(404,  'Order not found with this ID'));
    }

    if (order.orderStatus === 'Delivered') {
        return next(new ExpressError(400 , 'You have already delivered this order'));
    }

    order.orderItems.forEach(async (order) => {
        await updateStock(order.product, order.quantity);
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: 'Order updated successfully'
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

// delete order --admin
exports.deleteOrder = warpAsync(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
        return next(new ExpressError(404 , 'Order not found with this ID'));
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
    });
});