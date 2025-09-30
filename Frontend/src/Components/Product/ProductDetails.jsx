import  { Fragment, useEffect, useState } from "react";
import Slider from "react-slick";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { Rating } from "@mui/material";
import Loader from "../layouts/CircularProgressWithLabel.jsx";
import MetaData from "../layouts/MetaData.jsx";
import {
  getProductDetails,
  newReview,
  clearErrors,
    resetNewReview,
} from "../../features/productSlice";
import { addItemsToCart } from "../../features/cartSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductDetails.css";
import ReviewCard from "./ReviewCard.jsx";


const ProductDetails = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const { product, loading, error } = useSelector((state) => state.product);
  const { success, error: reviewError } = useSelector((state) => state.product);

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    fade: true,
    adaptiveHeight: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          dots: false,
          arrows: false,
        },
      },
    ],
  };

  const options = {
    size: "large",
    value: product.ratings || 0,
    readOnly: true,
    precision: 0.5,
  };

  // ✅ Modified Quantity Functions
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      enqueueSnackbar(`Only ${product.stock} items in stock`, {
        variant: "warning",
      });
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else {
      enqueueSnackbar("Minimum quantity is 1", { variant: "warning" });
    }
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart({ id, quantity }));
    enqueueSnackbar("Item Added To Cart", { variant: "success" });
  };

  const submitReviewToggle = () => setOpen(!open);

  const reviewSubmitHandler = () => {
    const myForm = {
      rating,
      comment,
      productId: id,
    };
    dispatch(newReview(myForm));
    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (reviewError) {
      enqueueSnackbar(reviewError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar("Review Submitted Successfully", { variant: "success" });
      dispatch(resetNewReview());
      dispatch(getProductDetails())
      dispatch(clearErrors());
    }

    dispatch(getProductDetails(id));
  }, [dispatch, id, error, reviewError, success, enqueueSnackbar]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData
            title={`${product.name} | ECOMMERCE`}
            description={product.description?.substring(0, 160) || ""}
            keywords={`${product.name}, ${product.category}, buy ${product.name}`}
          />

          <div className="ProductDetails">
            <div className="productSlider">
              {product.images?.length > 0 ? (
                <Slider {...sliderSettings}>
                  {product.images?.map((item, i) => (
                    <div key={i}>
                      <img
                        className="CarouselImage"
                        src={item.url}
                        alt={`Slide ${i + 1}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/default-product.png";
                        }}
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="no-image-placeholder">
                  <img
                    src="/images/default-product.png"
                    alt="No product image available"
                  />
                </div>
              )}
            </div>

            <div className="productInfo">
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>

              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  ({product.numOfReviews || 0} Reviews)
                </span>
              </div>

              <div className="detailsBlock-3">
                <h1>{`PKR${product.price}`}</h1>

                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    disabled={product.stock < 1}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b
                    className={product.stock < 1 ? "redColor" : "greenColor"}
                  >
                    {product.stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
                precision={0.5}
              />
              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="reviews">
              {product.reviews.map((review, i) => (
                <ReviewCard key={i} review={review} />
              ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
