import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AxiosInstance from '../../Utils/AxoisInstance';
import {baseURL} from '../../Utils/api';

export const fetchUpcomingOrders = createAsyncThunk(
  'order/fetchUpcomingOrders',
  async (_, {rejectWithValue}) => {
    try {
      const response = await AxiosInstance.get(`${baseURL}/upcoming_order_api`);
       console.log("gettttttttttting initial fetchupcomming order", response.data)
      if (response.data.status) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch data');
      }
    } catch (error) {
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
        formData.append('confirm', orderData.confirm );
      }
     console.log("EditUpcomming -----", formData);
     
      const response = await AxiosInstance.post(
        '/edit_upcoming_order_api',
        formData,
      );

      console.log('API Response:EditUpcomming', response.data);

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

export const fetchCustomers = createAsyncThunk(
  'order/fetchCustomers',
  async (_, {rejectWithValue}) => {
    try {
      const response = await AxiosInstance.get('/get_customers_details_api');
      
      if (response.data.status) {
        const transformedData = response.data.data.map(item => ({
          id: item.userid,
          name: item.company,
          vat: item.vat,
          phone: item.phonenumber,
          country: item.country,
          city: item.city,
          zip: item.zip,
          state: item.state,
          address: item.address,
          website: item.website,
          billing: {
            street: item.billing_street,
            city: item.billing_city,
            state: item.billing_state,
            zip: item.billing_zip,
            country: item.billing_country
          },
          shipping: {
            street: item.shipping_street,
            city: item.shipping_city,
            state: item.shipping_state,
            zip: item.shipping_zip,
            country: item.shipping_country
          }
        }));
        return { data: transformedData };
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch customers');
      }
    } catch (error) {
      console.error('Customers API Error:', error);
      return rejectWithValue(error.message || 'Network Error');
    }
  }
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
  customers: [],
  customersLoading: false,
  customersError: null,
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
        console.log("upcomingOrdersupcomingOrdersupcomingOrders-Redux", action.payload )
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

    // Add new reducers for customers
    builder
      .addCase(fetchCustomers.pending, state => {
        state.customersLoading = true;
        state.customersError = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customersLoading = false;
        state.customers = action.payload.data || [];
        state.customersError = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.customersLoading = false;
        state.customersError = action.payload;
      });
  },
});

export const {resetOrderState} = orderSlice.actions;

export default orderSlice.reducer;
