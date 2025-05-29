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

export const editUpcomingOrder = createAsyncThunk(
  'orders/editUpcomingOrder',
  async ({id, orderData}, {rejectWithValue}) => {
    try {
      const formData = new FormData();

      console.log('Edit Order Data:', {
        id,
        orderData,
      });

      formData.append('id', id.toString());
      formData.append('customer_id', orderData.customer_id?.toString() || '');
      formData.append(
        'customer_name',
        orderData.customer_details?.toString() || '',
      );
      formData.append(
        'product_grade',
        orderData.product_grade_id?.toString() || '',
      );
      formData.append('quantity', orderData.quantity?.toString() || '');
      formData.append('date', orderData.order_date || '');
      formData.append('on_site_time', orderData.on_site_time || '');
      formData.append('address', orderData.address || '');
      formData.append('order_type', orderData.order_type?.toString() || '');

      if (orderData.description) {
        formData.append('description', orderData.description);
      }
      if (orderData.confirm !== undefined) {
        formData.append('confirm', orderData.confirm ? '1' : '0');
      }

      const response = await AxiosInstance.post(
        '/edit_upcoming_order_api',
        formData,
      );

      console.log('API Response:', response.data);

      if (response.data.status) {
        return response.data;
      } else {
        const errorMessage = response.data.message || 'Failed to update order';
        console.log('Error Message:', errorMessage);
        if (response.data.errors) {
          console.log('Validation Errors:', response.data.errors);
        }
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      console.error('Edit order error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      const errorMessage =
        error.response?.data?.message || 'Failed to update order';
      if (error.response?.data?.errors) {
        console.log('Validation Errors:', error.response.data.errors);
      }
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchOrderDetails = createAsyncThunk(
  'order/fetchOrderDetails',
  async (id, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      formData.append('id', id.toString());

      const response = await AxiosInstance.post(
        '/get_order_details_api',
        formData,
      );

      if (response.data.status) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data.message || 'Failed to fetch order details',
        );
      }
    } catch (error) {
      console.error(
        'Fetch order details error:',
        error.response?.data || error.message,
      );
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order details',
      );
    }
  },
);

export const fetchProductGrades = createAsyncThunk(
  'order/fetchProductGrades',
  async (_, {rejectWithValue}) => {
    try {
      const response = await AxiosInstance.get('/product_grade_api');
      
      if (response.data.status) {
        const transformedData = response.data.data.map(item => ({
          id: item.id.toString(),
          name: item.name || item.product_name || 'Unknown Product'
        }));
        return { data: transformedData };
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch product grades');
      }
    } catch (error) {
      console.error('Product Grades API Error:', error); 
      return rejectWithValue(error.message || 'Network Error');
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
  productGrades: [],
  productGradesLoading: false,
  productGradesError: null,
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

    builder
      .addCase(editUpcomingOrder.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editUpcomingOrder.fulfilled, state => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(editUpcomingOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });

    // Fetch Order Details
    builder
      .addCase(fetchOrderDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add new reducers for product grades
    builder
      .addCase(fetchProductGrades.pending, state => {
        state.productGradesLoading = true;
        state.productGradesError = null;
      })
      .addCase(fetchProductGrades.fulfilled, (state, action) => {
        state.productGradesLoading = false;
        state.productGrades = action.payload.data || [];
        state.productGradesError = null;
      })
      .addCase(fetchProductGrades.rejected, (state, action) => {
        state.productGradesLoading = false;
        state.productGradesError = action.payload;
      });
  },
});

export const {resetOrderState} = orderSlice.actions;

export default orderSlice.reducer;
