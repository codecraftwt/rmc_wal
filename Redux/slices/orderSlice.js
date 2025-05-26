// src/slices/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/AxoisInstance';

// Thunk to add an upcoming order
export const addUpcomingOrder = createAsyncThunk(
  'order/addUpcomingOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('customer_name', orderData.customer_details);
      formData.append('product_grade', orderData.productGrade);
      formData.append('quantity', orderData.quantity);
      formData.append('date', orderData.date);
      formData.append('on_site_time', orderData.onsiteTime);
      formData.append('address', orderData.address);
      formData.append('order_type', orderData.type);
      if (orderData.description) {
        formData.append('description', orderData.description);
      }
      if (orderData.confirm !== undefined) {
        formData.append('confirm', orderData.confirm);
      }

      const response = await axiosInstance.post('/add_upcoming_order_api', formData);
      console.log("Order data --->", response.data);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetOrderState: state => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addUpcomingOrder.pending, state => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addUpcomingOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(addUpcomingOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;

export default orderSlice.reducer;
