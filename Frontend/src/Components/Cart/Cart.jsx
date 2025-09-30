import React, { Fragment } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeItemsFromCart } from "../../features/cartSlice";
import { Typography, Button } from "@mui/material";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  // Increase item quantity
  const increaseQuantity = (item) => {
    const newQty = item.quantity + 1;
    if (newQty <= item.stock) {
      dispatch(addItemsToCart({ id: item.product, quantity: newQty }));
    }else {
      enqueueSnackbar(`Only ${item.stock} items in stock`, { variant: "warning" });
    }
  };
  // Decrease item quantity
  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      const newQty = item.quantity - 1;
      dispatch(addItemsToCart({ id: item.product, quantity: newQty }));
    }else {
      enqueueSnackbar("Minimum quantity is 1", { variant: "warning" });
    }
  };
  // Remove item from cart
  const deleteCartItems = (id) => {
    dispatch(removeItemsFromCart(id));
  };

  // Proceed to checkout
  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  // Calculate gross total
  const grossTotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <Fragment>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon fontSize="large" />
          <Typography>No Product in Your Cart</Typography>
          <Link to="/products">View Products</Link>
        </div>
      ) : (
        <div className="cartPage">
          {/* Header */}
          <div className="cartHeader">
            <p>Product</p>
            <p className="Quantity"> Quantity</p>
            <p>Subtotal</p>
          </div>

          {/* Cart Items */}
          {cartItems.map((item) => (
            <div className="cartContainer" key={item.product}>
              {/* Product Info */}
              <CartItemCard item={item} deleteCartItems={deleteCartItems} />

              {/* Quantity Controls */}
              <div className="cartInput ">
                <button onClick={() => decreaseQuantity(item)}>-</button>
                <input type="number" value={item.quantity} readOnly />
                <button onClick={() => increaseQuantity(item)}>+</button>
              </div>

              {/* Subtotal */}
              <p className="cartSubtotal">{`₹${item.price * item.quantity}`}</p>
            </div>
          ))}

          {/* Gross Total Section */}
          <div>
            <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Gross Total</p>
                <p>{`₹${grossTotal}`}</p>
              </div>
            </div>
              <div className="checkOutBtn">
                <div></div>
                <Button onClick={checkoutHandler}>Check Out</Button>
              </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Cart;
