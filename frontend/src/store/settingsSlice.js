import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/api';

export const fetchSiteSettings = createAsyncThunk('settings/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/settings');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const updateSiteSettings = createAsyncThunk('settings/update', async (data, { rejectWithValue }) => {
  try {
    const res = await API.put('/settings', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchSubscribers = createAsyncThunk('settings/subscribers', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/settings/subscribers');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const subscribeMail = createAsyncThunk('settings/subscribe', async (email, { rejectWithValue }) => {
  try {
    const res = await API.post('/settings/subscribe', { email });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    siteMode: 'live',
    brandStory: '',
    launchDate: null,
    subscribers: [],
    loaded: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteSettings.pending, (state) => { state.loading = true; })
      .addCase(fetchSiteSettings.fulfilled, (state, action) => {
        state.siteMode = action.payload.siteMode;
        state.brandStory = action.payload.brandStory || '';
        state.launchDate = action.payload.launchDate || null;
        state.loaded = true;
        state.loading = false;
      })
      .addCase(fetchSiteSettings.rejected, (state) => { state.loading = false; state.loaded = true; })
      .addCase(updateSiteSettings.fulfilled, (state, action) => {
        state.siteMode = action.payload.siteMode;
        state.brandStory = action.payload.brandStory || '';
        state.launchDate = action.payload.launchDate || null;
      })
      .addCase(fetchSubscribers.fulfilled, (state, action) => { state.subscribers = action.payload; });
  },
});

export default settingsSlice.reducer;
