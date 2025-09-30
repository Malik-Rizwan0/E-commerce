// src/features/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api"; // ✅ updated import

// 🔹 Add to Cart
export const addItemsToCart = createAsyncThunk(
  "cart/addItemsToCart",
  async ({ id, quantity }) => {
    const { data } = await api.get(`/api/v1/product/${id}`); // ✅ replaced axios with api

    return {
      product: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images?.[0]?.url || "/fallback.png",
      stock: data.product.stock,
      quantity,
    };
  }
);

// 🔹 Remove from Cart
export const removeItemsFromCart = createAsyncThunk(
  "cart/removeItemsFromCart",
  async (id) => id
);

// 🔹 Save Shipping Info
export const saveShippingInfo = createAsyncThunk(
  "cart/saveShippingInfo",
  async (data) => data
);

// 🔹 Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
  reducers: {
    // ✅ Clear Cart
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addItemsToCart.fulfilled, (state, action) => {
      const item = action.payload;
      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === isItemExist.product ? item : i
        );
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    });

    builder.addCase(removeItemsFromCart.fulfilled, (state, action) => {
      state.cartItems = state.cartItems.filter(
        (i) => i.product !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    });

    builder.addCase(saveShippingInfo.fulfilled, (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
