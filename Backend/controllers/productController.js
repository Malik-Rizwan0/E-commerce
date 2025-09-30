const Product = require('../models/productModel.js');
const ApiFeatures = require('../utils/apiFeatures.js');
const ExpressError = require("../utils/ExpressError.js")
const warpAsync = require("../utils/warpAsync.js")
const cloudinary = require("cloudinary");




// Create Product -- Admin
exports.createProduct = warpAsync(async (req, res, next) => {
  let images = [];

  if (req.files) {
    if (Array.isArray(req.files.images)) {
      images = req.files.images; // multiple files
    } else {
      images.push(req.files.images); // single file
    }
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i].tempFilePath, {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});


// Get all products 
exports.getAllProducts = warpAsync(async (req, res) => {
  
  const resultPerPage = 8;
  const productCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeatures.query;
  let filteredProductsCount = products.length;

  apiFeatures.pagination(resultPerPage);
  products = await apiFeatures.query.clone();

  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    filteredProductsCount,
  });
});
// Get All Product (Admin)
exports.getAdminProducts = warpAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Get product details by ID
exports.getProductDetails = warpAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new ExpressError(404, 'Product not found');
    }
    res.status(200).json({
        success: true,
        product
    });
})

// Update product details --- admin

exports.updateProduct = warpAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ExpressError(404, "Product not found"));
  }

  let imagesLinks = [];

  // -------------------------
  // 1. Handle new image uploads
  // -------------------------
  if (req.files && req.files.images) {
    let images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(
        images[i].tempFilePath,
        { folder: "products" }
      );

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }

  // -------------------------
  // 2. Parse kept old images (frontend sends only public_ids)
  // -------------------------
  let oldImages = [];
  if (req.body.oldImages) {
    try {
      oldImages = JSON.parse(req.body.oldImages); // ["public_id1","public_id2"]
    } catch (e) {
      oldImages = [];
    }
  }

  // -------------------------
  // 3. Merge old + new images
  // -------------------------
  const keptOldImages = product.images.filter((img) =>
    oldImages.includes(img.public_id)
  );
  console.log("Kept Old:", oldImages);
console.log("Uploaded New:", imagesLinks);
  // Final images array (old kept + new uploaded)
  req.body.images = [...keptOldImages, ...imagesLinks];

  // -------------------------
  // 4. Normalize stock
  // -------------------------
  if (req.body.Stock) {
    req.body.stock = req.body.Stock;
    delete req.body.Stock;
  }

  // -------------------------
  // 5. Update product
  // -------------------------
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});



// delete product --- admin
exports.deleteProduct = warpAsync(async (req, res, next) => {

    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new ExpressError(404, 'Product not found');
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });

})

// Review a product
exports.createProductReview = warpAsync(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };
    
    const product = await Product.findById(productId);
    if (!product) {
        throw new ExpressError(404, 'Product not found');
    }
    
    // Check if the user has already reviewed the product
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );
    
    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    
    // Calculate average rating
    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    
    await product.save({ validateBeforeSave: false });
    
    res.status(200).json({
        success: true,
        message: 'Review added successfully',
        product
    });
})

// Get all reviews of a product
exports.getProductReviews = warpAsync(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        throw new ExpressError(404, 'Product not found');
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
})
// Delete a review
exports.deleteReview = warpAsync(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        throw new ExpressError(404, 'Product not found');
    }

    // Filter out the review to be deleted
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    const numOfReviews = reviews.length;

    // Calculate new average rating from filtered reviews
    const ratings = numOfReviews > 0
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews
        : 0;

    // Update product with new reviews and rating
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
        reviews
    });
});
