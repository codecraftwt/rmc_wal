import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AxiosInstance from '../../Utils/AxoisInstance';
import {baseURL} from '../../Utils/api';

export const addUpcomingOrder = createAsyncThunk(
  'order/addUpcomingOrder',
  async (orderData, {rejectWithValue}) => {
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

      const response = await AxiosInstance.post(
        '/add_upcoming_order_api',
        formData,
      );
      // console.log('Order data --->', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong',
      );
    }
  },
);

export const fetchUpcomingOrders = createAsyncThunk(
  'order/fetchUpcomingOrders',
  async (_, {rejectWithValue}) => {
    try {
      const response = await AxiosInstance.get(`${baseURL}/upcoming_order_api`);

      if (response.data.status) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch data');
      }
    } catch (error) {
      // console.log('API call error:', error);
      return rejectWithValue(error.message || 'Network Error');
    }
  },
);

export const deleteUpcomingOrder = createAsyncThunk(
  'orders/deleteUpcomingOrder',
  async (id, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      formData.append('id', id.toString());

      const response = await AxiosInstance.post(
        '/delete_upcoming_order_api',
        formData,
      );
      return response.data;
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  loading: false,
  success: false,
  error: null,
  upcomingOrders: null,
  orderDetails: null,
  deleteLoading: false,
  deleteSuccess: false,
  deleteError: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: state => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Add Upcoming Order
    builder
      .addCase(addUpcomingOrder.pending, state => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addUpcomingOrder.fulfilled, state => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(addUpcomingOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });

    // Fetch Upcoming Orders
    builder
      .addCase(fetchUpcomingOrders.pending, state => {
        console.log('Fetch orders pending - setting loading to true');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingOrders.fulfilled, (state, action) => {
        console.log(
          'Fetch orders fulfilled - setting loading to false and updating orders',
        );
        state.loading = false;
        state.upcomingOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchUpcomingOrders.rejected, (state, action) => {
        console.log(
          'Fetch orders rejected - setting loading to false and error:',
          action.payload,
        );
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Upcoming Order
    builder
      .addCase(deleteUpcomingOrder.pending, state => {
        state.deleteLoading = true;
        state.deleteSuccess = false;
        state.deleteError = null;
      })
      .addCase(deleteUpcomingOrder.fulfilled, state => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.deleteError = null;
      })
      .addCase(deleteUpcomingOrder.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = false;
        state.deleteError = action.payload;
      });

    // builder
    //   .addCase(editUpcomingOrder.pending, state => {
    //     state.loading = true;
    //     state.error = null;
    //     state.success = false;
    //   })
    //   .addCase(editUpcomingOrder.fulfilled, state => {
    //     state.loading = false;
    //     state.success = true;
    //     state.error = null;
    //   })
    //   .addCase(editUpcomingOrder.rejected, (state, action) => {
    //     state.loading = false;
    //     state.success = false;
    //     state.error = action.payload;
    //   });

    // Fetch Order Details
    // builder
    //   .addCase(fetchOrderDetails.pending, state => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchOrderDetails.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.orderDetails = action.payload;
    //     state.error = null;
    //   })
    //   .addCase(fetchOrderDetails.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });
  },
});

export const {resetOrderState} = orderSlice.actions;

export default orderSlice.reducer;
