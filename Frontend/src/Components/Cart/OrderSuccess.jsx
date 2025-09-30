import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "./OrderSucces.css";

const OrderSuccess = () => {
  return (
    <div className="orderSuccess">
      <CheckCircleIcon sx={{ fontSize: 60, color: "green", mb: 2 }} />

      <Typography variant="h6" gutterBottom>
        Your order has been placed successfully 🎉
      </Typography>

      <Link to="/orders" className="orderLink">
        View Orders
      </Link>
    </div>
  );
};

export default OrderSuccess;
