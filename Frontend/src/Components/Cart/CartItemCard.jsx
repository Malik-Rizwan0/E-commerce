import React from "react";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import "./CartItemCard.css";

const CartItemCard = ({ item, deleteCartItems }) => {
  return (
    <div className="CartItemCard">
      {/* Product Image */}
      <div className="CartItemCardImage">
        <img src={item.image} alt={item.name} />
      </div>

      {/* Product Details */}
      <div className="CartItemCardDetails">
        <Link to={`/product/${item.product}`} className="CartItemCardName">
          {item.name}
        </Link>
        <span className="CartItemCardPrice">{`₹${item.price}`}</span>
        <button
          className="CartItemCardRemove"
          onClick={() => deleteCartItems(item.product)}
        >
          <DeleteIcon fontSize="small" /> Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
