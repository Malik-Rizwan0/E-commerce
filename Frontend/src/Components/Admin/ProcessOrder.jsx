import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";

// MUI
import { Typography, Button } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

// Components
import MetaData from "../layouts/MetaData";
import SideBar from "./Sidebar";
import CircularProgressWithLabel from "../layouts/CircularProgressWithLabel";

// Redux
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
  resetUpdate,
} from "../../features/orderSlice";

import "./ProcessOrder.css";

const ProcessOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { orderDetails, error, loading, isUpdated } = useSelector(
    (state) => state.order
  );

  const [status, setStatus] = useState("");

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("status", status);

    dispatch(updateOrder({ id, orderData: myForm }));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (isUpdated) {
      enqueueSnackbar("Order Updated Successfully", { variant: "success" });
      navigate("/admin/orders");
      dispatch(resetUpdate());
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, enqueueSnackbar, error, isUpdated, id, navigate]);

  return (
    <Fragment>
      <MetaData title="Process Order" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {loading ? (
            <CircularProgressWithLabel />
          ) : (
            <div
              className="confirmOrderPage"
              style={{
                display:
                  orderDetails.orderStatus === "Delivered" ? "block" : "grid",
              }}
            >
              {/* Left Section */}
              <div>
                <div className="confirmshippingArea">
                  <Typography>Shipping Info</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p>Name:</p>
                      <span>{orderDetails.user?.name}</span>
                    </div>
                    <div>
                      <p>Phone:</p>
                      <span>{orderDetails.shippingInfo?.phoneNo}</span>
                    </div>
                    <div>
                      <p>Address:</p>
                      <span>
                        {orderDetails.shippingInfo &&
                          `${orderDetails.shippingInfo.address}, ${orderDetails.shippingInfo.city}, ${orderDetails.shippingInfo.state}, ${orderDetails.shippingInfo.pinCode}, ${orderDetails.shippingInfo.country}`}
                      </span>
                    </div>
                  </div>

                  <Typography>Payment</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          orderDetails.paymentInfo?.status === "succeeded"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {orderDetails.paymentInfo?.status === "succeeded"
                          ? "PAID"
                          : "NOT PAID"}
                      </p>
                    </div>
                    <div>
                      <p>Amount:</p>
                      <span>{orderDetails.totalPrice}</span>
                    </div>
                  </div>

                  <Typography>Order Status</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          orderDetails.orderStatus === "Delivered"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {orderDetails.orderStatus}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="confirmCartItems">
                  <Typography>Your Cart Items:</Typography>
                  <div className="confirmCartItemsContainer">
                    {orderDetails.orderItems &&
                      orderDetails.orderItems.map((item) => (
                        <div key={item.product}>
                          <img src={item.image} alt="Product" />
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>{" "}
                          <span>
                            {item.quantity} X ₹{item.price} ={" "}
                            <b>₹{item.price * item.quantity}</b>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div
                style={{
                  display:
                    orderDetails.orderStatus === "Delivered" ? "none" : "block",
                }}
              >
                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h1>Process Order</h1>

                  <div>
                    <AccountTreeIcon />
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Choose Status</option>
                      {orderDetails.orderStatus === "Processing" && (
                        <option value="Shipped">Shipped</option>
                      )}
                      {orderDetails.orderStatus === "Shipped" && (
                        <option value="Delivered">Delivered</option>
                      )}
                    </select>
                  </div>

                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={loading || status === ""}
                  >
                    Process
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
