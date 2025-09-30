import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./productReviews.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAllReviews,
  deleteReview,
  resetDeleteProduct, // 👈 reuse this to reset isDeleted
} from "../../features/productSlice"; 
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";
import MetaData from "../layouts/MetaData";
import DeleteIcon from "@mui/icons-material/Delete";
import Star from "@mui/icons-material/Star";
import SideBar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const ProductReviews = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { error, reviews, loading, isDeleted } = useSelector(
    (state) => state.product
  );

  const [productId, setProductId] = useState("");

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReview({ reviewId, productId }));
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReviews(productId));
  };

  useEffect(() => {
    if (productId.length === 24) {
      dispatch(getAllReviews(productId));
    }

    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }

    if (isDeleted) {
      enqueueSnackbar("Review Deleted Successfully", { variant: "success" });
      navigate("/admin/reviews");
      dispatch(resetDeleteProduct()); // 👈 reset instead of DELETE_REVIEW_RESET
    }
  }, [dispatch, enqueueSnackbar, error, isDeleted, productId, navigate]);

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },
    { field: "user", headerName: "User", minWidth: 200, flex: 0.6 },
    { field: "comment", headerName: "Comment", minWidth: 350, flex: 1 },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 180,
      flex: 0.4,
      cellClassName: (params) =>
        params.row.rating >= 3 ? "greenColor" : "redColor",
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Fragment>
          <Button onClick={() => deleteReviewHandler(params.row.id)}>
            <DeleteIcon />
          </Button>
        </Fragment>
      ),
    },
  ];

  const rows = reviews
    ? reviews.map((item) => ({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
      }))
    : [];

  return (
    <Fragment>
      <MetaData title={`ALL REVIEWS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productReviewsContainer">
          <form
            className="productReviewsForm"
            onSubmit={productReviewsSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

            <div>
              <Star />
              <input
                type="text"
                placeholder="Product Id"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading || productId === ""}
            >
              Search
            </Button>
          </form>

          {reviews && reviews.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableRowSelectionOnClick
              className="productListTable"
              autoHeight
            />
          ) : (
            <h1 className="productReviewsFormHeading">No Reviews Found</h1>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;
