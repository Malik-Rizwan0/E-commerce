// src/features/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import  api  from "../api"; // ✅ Replaced axios import

// ------------------- Async Thunks -------------------

// Get All Products (With Filters)
export const getProducts = createAsyncThunk(
  'product/getProducts',
  async ({ keyword = '', currentPage = 1, price = [0, 80000], category, ratings = 0 }, thunkAPI) => {
    try {
      let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
      if (category) link += `&category=${category}`;

      const { data } = await api.get(link); // ✅ Replaced axios with api
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Admin: Get All Products
export const getAdminProducts = createAsyncThunk(
  'product/getAdminProducts',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/api/v1/admin/products'); // ✅ api
      return data.products;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Create Product
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, thunkAPI) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await api.post("/api/v1/admin/product/new", productData, config); // ✅ api
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Update Product
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, productData }, thunkAPI) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await api.put(`/api/v1/admin/product/${id}`, productData, config); // ✅ api
      return data.success;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, thunkAPI) => {
    try {
      const { data } = await api.delete(`/api/v1/admin/product/${id}`); // ✅ api
      return data.success;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Get Product Details
export const getProductDetails = createAsyncThunk(
  'product/getProductDetails',
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/api/v1/product/${id}`); // ✅ api
      return data.product;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Submit Review
export const newReview = createAsyncThunk(
  'product/newReview',
  async (reviewData, thunkAPI) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await api.put('/api/v1/reviews', reviewData, config); // ✅ api
      return data.success;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Admin: Get All Reviews
export const getAllReviews = createAsyncThunk(
  'product/getAllReviews',
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/api/v1/reviews?id=${id}`); // ✅ api
      return data.reviews;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Admin: Delete Review
export const deleteReview = createAsyncThunk(
  'product/deleteReview',
  async ({ reviewId, productId }, thunkAPI) => {
    try {
      const { data } = await api.delete(`/api/v1/reviews?id=${reviewId}&productId=${productId}`); // ✅ api
      return data.success;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// ------------------- Slice -------------------

const productSlice = createSlice({
  name: 'product',
  initialState: {
    loading: false,
    products: [],
    product: {},
    reviews: [],
    error: null,
    success: false,
    isDeleted: false,
    isUpdated: false,
    productsCount: 0,
    resultPerPage: 0,
    filteredProductsCount: 0,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    resetNewProduct: (state) => {
      state.success = false;
    },
    resetDeleteProduct: (state) => {
      state.isDeleted = false;
    },
    resetUpdateProduct: (state) => {
      state.isUpdated = false;
    },
    resetNewReview: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.productsCount = action.payload.productCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.filteredProductsCount = action.payload.filteredProductsCount;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.product = action.payload.product;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isUpdated = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isDeleted = action.payload;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.product = action.payload;
      })
      .addCase(newReview.fulfilled, (state, action) => {
        state.success = action.payload;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isDeleted = action.payload;
      });
  },
});

// ------------------- Export -------------------

export const {
  clearErrors,
  resetNewProduct,
  resetDeleteProduct,
  resetUpdateProduct,
  resetNewReview,
} = productSlice.actions;

export default productSlice.reducer;
