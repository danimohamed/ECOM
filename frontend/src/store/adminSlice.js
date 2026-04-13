import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/api';

export const fetchAdminStats = createAsyncThunk('admin/stats', async (_, { rejectWithValue }) => {
  try {
    const [orders, users, products] = await Promise.all([
      API.get('/orders/stats'),
      API.get('/users/count'),
      API.get('/products', { params: { limit: 1 } }),
    ]);
    return {
      totalSales: orders.data.totalSales,
      totalOrders: orders.data.totalOrders,
      monthlyRevenue: orders.data.monthlyRevenue,
      totalUsers: users.data.count,
      totalProducts: products.data.total,
    };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
  }
});

export const fetchAdminOrders = createAsyncThunk('admin/orders', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await API.get('/orders', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const updateOrderStatus = createAsyncThunk('admin/updateOrder', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/orders/${id}/status`, { status });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchAdminUsers = createAsyncThunk('admin/users', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/users');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/users/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const updateUserRole = createAsyncThunk('admin/updateRole', async ({ id, role }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/users/${id}/role`, { role });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchAdminProducts = createAsyncThunk('admin/products', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await API.get('/products', { params: { ...params, limit: 50 } });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const createProduct = createAsyncThunk('admin/createProduct', async (formData, { rejectWithValue }) => {
  try {
    const res = await API.post('/products', formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const editProduct = createAsyncThunk('admin/editProduct', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/products/${id}`, formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/products/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchAdminPayments = createAsyncThunk('admin/payments', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/payments');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchAdminCoupons = createAsyncThunk('admin/coupons', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/coupons');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const createCoupon = createAsyncThunk('admin/createCoupon', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/coupons', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const deleteCoupon = createAsyncThunk('admin/deleteCoupon', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/coupons/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    orders: { items: [], total: 0, pages: 1 },
    users: [],
    products: { items: [], total: 0 },
    payments: [],
    coupons: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.fulfilled, (state, action) => { state.stats = action.payload; })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => { state.orders = { items: action.payload.orders, total: action.payload.total, pages: action.payload.pages }; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.items.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.orders.items[idx] = action.payload;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => { state.users = action.payload; })
      .addCase(deleteUser.fulfilled, (state, action) => { state.users = state.users.filter(u => u._id !== action.payload); })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex(u => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => { state.products = { items: action.payload.products, total: action.payload.total }; })
      .addCase(createProduct.fulfilled, (state, action) => { state.products.items.unshift(action.payload); })
      .addCase(editProduct.fulfilled, (state, action) => {
        const idx = state.products.items.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) state.products.items[idx] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => { state.products.items = state.products.items.filter(p => p._id !== action.payload); })
      .addCase(fetchAdminPayments.fulfilled, (state, action) => { state.payments = action.payload; })
      .addCase(fetchAdminCoupons.fulfilled, (state, action) => { state.coupons = action.payload; })
      .addCase(createCoupon.fulfilled, (state, action) => { state.coupons.unshift(action.payload); })
      .addCase(deleteCoupon.fulfilled, (state, action) => { state.coupons = state.coupons.filter(c => c._id !== action.payload); });
  },
});

export default adminSlice.reducer;
