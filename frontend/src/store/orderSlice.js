import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/api';

export const createOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/orders', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Order failed');
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/orders/mine');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearOrderState: (state) => { state.success = false; state.error = null; state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.success = false; })
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; state.success = true; })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
