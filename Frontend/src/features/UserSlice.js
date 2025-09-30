import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api"; // ✅ Use centralized axios instance

// ------------------ Async Thunks ------------------

// Login
export const login = createAsyncThunk("user/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await api.post(`/api/v1/login`, { email, password }, config);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Register
export const register = createAsyncThunk("user/register", async (userData, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await api.post(`/api/v1/register`, userData, config);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Load User
export const loadUser = createAsyncThunk("user/load", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/v1/profile`);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Logout
export const logout = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
  try {
    await api.get(`/api/v1/logout`);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Update Profile
export const updateProfile = createAsyncThunk("profile/update", async (userData, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await api.put(`/api/v1/profile/update`, userData, config);
    return data.success;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Update Password
export const updatePassword = createAsyncThunk("profile/updatePassword", async (passwords, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await api.put(`/api/v1/password/update`, passwords, config);
    return data.success;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Forgot Password
export const forgotPassword = createAsyncThunk("user/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await api.post(`/api/v1/password/forget`, email, config);
    return data.message;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Reset Password
export const resetPassword = createAsyncThunk("user/resetPassword", async ({ token, passwords }, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await api.put(`/api/v1/password/reset/${token}`, passwords, config);
    return data.success;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Admin: All Users
export const getAllUsers = createAsyncThunk("admin/getAllUsers", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/v1/admin/users`);
    return data.users;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Admin: Get User Details
export const getUserDetails = createAsyncThunk("admin/getUserDetails", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/v1/admin/user/${id}`);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Admin: Update User
export const updateUser = createAsyncThunk("admin/updateUser", async ({ id, userData }, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await api.put(`/api/v1/admin/user/${id}`, userData, config);
    return data.success;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Admin: Delete User
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/api/v1/admin/user/${id}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// ------------------ Slice ------------------

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    selectedUser: null,
    users: [],
    loading: false,
    isAuthenticated: false,
    isUpdated: false,
    isDeleted: false,
    error: null,
    message: null,
    success: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    resetUpdate: (state) => {
      state.isUpdated = false;
    },
    resetDelete: (state) => {
      state.isDeleted = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Profile Update
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Password Update
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })

      // Admin: All Users
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })

      // Admin: Get User Details
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })

      // Admin: Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
      })

      // Admin: Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload.success;
        state.message = action.payload.message;
      });
  },
});

export const { clearErrors, resetUpdate, resetDelete } = userSlice.actions;
export default userSlice.reducer;
