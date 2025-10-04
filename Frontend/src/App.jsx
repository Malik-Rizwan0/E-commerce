import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/layouts/Header/Header.jsx';
import Footer from './Components/layouts/Footer/Footer.jsx';
import Home from './Components/Home/Home.jsx';
import ProductDetails from './Components/Product/ProductDetails.jsx';
import Products from './Components/Product/Products.jsx';
import LoginSignUp from './Components/User/LoginSignUp.jsx';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './features/UserSlice.js';
import Profile from './Components/User/Profile.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import UpdatePassword from './Components/User/UpdatePassword.jsx';
import UpdateProfile from './Components/User/UpdateProfile.jsx';
import ForgetPassword from './Components/User/ForgetPassword.jsx';
import ResetPassword from './Components/User/ResetPassword.jsx';
import Cart from './Components/Cart/Cart.jsx';
import Shipping from './Components/Cart/Shipping.jsx';
import ConfirmOrder from './Components/Cart/ConfirmOrder.jsx';
import Payment from "./Components/Cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from './Components/Cart/OrderSuccess.jsx';
import NotFound from './Components/layouts/Not Found/NotFound.jsx';
import MyOrders from './Components/Order/MyOrders.jsx';
import OrderDetails from './Components/Order/OrderDetails.jsx';
import Dashboard from './Components/Admin/DashBoard.jsx';

import axios from 'axios';
import ProductList from './Components/Admin/ProductList.jsx';
import NewProduct from './Components/Admin/NewProduct.jsx';
import UpdateProduct from './Components/Admin/UpdateProduct.jsx';
import OrderList from './Components/Admin/OrderList.jsx';
import ProcessOrder from './Components/Admin/ProcessOrder.jsx';
import UsersList from './Components/Admin/UsersList.jsx';
import UpdateUser from './Components/Admin/UpdateUser.jsx';
import About from './Components/layouts/About/About.jsx';
import ContactUs from './Components/layouts/Contact/ContactUs.jsx';
import ProductReviews from './Components/Admin/ProductReviews.jsx';

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  const dispatch = useDispatch();

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

useEffect(() => {
  dispatch(loadUser());
  getStripeApiKey();
}, [dispatch]);

// Optional fallback ONLY IF no backend key returned
useEffect(() => {
  if (!stripeApiKey) {
    setStripeApiKey(import.meta.env.VITE_STRIPE_API_KEY);
  }
}, [stripeApiKey]);

  window.addEventListener("contextmenu", (e) => e.preventDefault());
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignUp />} />
          <Route path="/password/forgot" element={<ForgetPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<Profile />} />
            <Route path="/profile/update" element={<UpdateProfile />} />
            <Route path="/password/update" element={<UpdatePassword />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/order/confirm" element={<ConfirmOrder />} />
            <Route
              path="/process/payment"
              element={
                stripeApiKey ? (
                  <Elements stripe={loadStripe(stripeApiKey)}>
                    <Payment />
                  </Elements>
                ) : (
                  <div>Loading payment module...</div>
                )
              }
            />
            <Route path="/success" element={<OrderSuccess />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute isAdmin={true} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/product" element={<NewProduct />} />
            <Route path="/admin/product/:id" element={<UpdateProduct />} />
            <Route path="/admin/orders" element={<OrderList />} />
            <Route path="/admin/order/:id" element={<ProcessOrder />} />
            <Route path="/admin/users" element={<UsersList />} />
            <Route path="/admin/user/:id" element={<UpdateUser />} />
            <Route path="/admin/reviews" element={<ProductReviews />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
