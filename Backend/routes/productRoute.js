const express = require('express');
const { getAllProducts ,createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews , deleteReview , getAdminProducts} = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const router = express.Router();    
const fileUpload = require("express-fileupload");


router
.route('/products')
.get(getAllProducts);
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
router
.route('/admin/product/new')
.post(isAuthenticatedUser , authorizeRoles("admin"), fileUpload({ useTempFiles: true }), createProduct);
router
.route('/admin/product/:id')
.put(isAuthenticatedUser , authorizeRoles("admin"),  fileUpload({ useTempFiles: true }), updateProduct)
.delete(isAuthenticatedUser , authorizeRoles("admin") ,deleteProduct)
router.route('/product/:id')
.get( getProductDetails);

router.route("/reviews").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(isAuthenticatedUser, getProductReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router;