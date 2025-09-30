import { configureStore } from '@reduxjs/toolkit';
import productReducer from './features/productSlice';
import userReducer from "./features/UserSlice";
import cartReducer from './features/cartSlice';
import orderReducer from './features/orderSlice';

export const store = configureStore({
  reducer: {
    product: productReducer, // <-- correct key
    user: userReducer, // <-- correct key
    cart: cartReducer, // <-- correct key
    order: orderReducer, // <-- correct key
  },
});
