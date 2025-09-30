import React, { Fragment, useState } from "react";
import "./Header.css";
import { Backdrop, SpeedDial, SpeedDialAction , Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/UserSlice.js";
import { useSnackbar } from "notistack";

import Useravatar from "/Profile.png"
const UserOptions = ({ user }) => {
  const { cartItems } = useSelector((state) => state.cart );
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const dashboard = () => navigate("/admin/dashboard");
  const orders = () => navigate("/orders");
  const account = () => navigate("/account");
  const cart = () => navigate("/cart");

  const logoutUser = () => {
    dispatch(logout());
    enqueueSnackbar("Logout Successfully", { variant: "success" });
  };

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      name: `Cart(${cartItems.length})`,
      func: cart,
    },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  user?.role === "admin" &&
  options.unshift({
    icon: <DashboardIcon />,
    name: "Dashboard",
    func: dashboard,
  });


  return (
    <Fragment>
      <Backdrop open={open} sx={{ zIndex: 10 }} />
      <SpeedDial
        ariaLabel="SpeedDial User Options"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        sx={{ zIndex: 11 }}
        open={open}
        direction="down"
        className="speedDial"
        icon={
         <Box
      component="img"
      src={user?.avatar?.url || "https://res.cloudinary.com/dnyfyjwv4/image/upload/v1753524667/Profile_hlpyz2.png"}
      alt="Profile"
      sx={{
        width: { xs: 40, md: 50 }, 
        height: { xs: 40, md: 50 },
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
        }
        
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;
