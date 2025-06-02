// slices/addOrderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '../../Utils/AxoisInstance';

// Async Thunk to call the API
export const addUpcomingOrder = createAsyncThunk(
  'orders/addUpcomingOrder',
  async (formData, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append('customer_name', formData.customer_name); // assuming it's an ID
      form.append('product_grade', formData.product_grade);
      form.append('quantity', formData.quantity);
      form.append('date', formData.date);
      form.append('on_site_time', formData.on_site_time);
      form.append('address', formData.address);
      form.append('order_type', formData.order_type); // 1 / 2
      if (formData.description) form.append('description', formData.description);
      form.append('confirm', formData.confirm);

      const response = await AxiosInstance.post(
        '/add_upcoming_order_api',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      console.log("Added--->", response.data);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add order');
    }
  }
);

const addOrderSlice = createSlice({
  name: 'addOrder',
  initialState: {
    loading: false,
    success: false,
    error: null,
    responseData: null,
  },
  reducers: {
    resetAddOrderState: state => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.responseData = null;
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
        state.responseData = action.payload;
      })
      .addCase(addUpcomingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAddOrderState } = addOrderSlice.actions;
export default addOrderSlice.reducer;
