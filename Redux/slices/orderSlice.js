import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '../../Utils/AxoisInstance';
import { baseURL } from '../../Utils/api';

export const fetchUpcomingOrders = createAsyncThunk(
  'order/fetchUpcomingOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`${baseURL}/upcoming_order_api`);
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
  async (id, { rejectWithValue }) => {
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
  async ({ id, orderData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

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
        formData.append('confirm', orderData.confirm);
      }

      const response = await AxiosInstance.post(
        '/edit_upcoming_order_api',
        formData,
      );


      if (response.data.status) {
        return response.data;
      } else {
        const errorMessage = response.data.message || 'Failed to update order';
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
  async (_, { rejectWithValue }) => {
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
  async (_, { rejectWithValue }) => {
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
          default_language: item.default_language,
          default_currency: item.default_currency,
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

export const fetchCustomerFormData = createAsyncThunk(
  'order/fetchCustomerFormData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get('/get_customer_form_data_api');

      if (response.data.status) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch form data');
      }
    } catch (error) {
      console.error('Customer Form Data API Error:', error);
      return rejectWithValue(error.message || 'Network Error');
    }
  }
);

export const addCustomer = createAsyncThunk(
  'order/addCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Append all customer data to formData
      Object.entries(customerData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await AxiosInstance.post('/add_customers_api', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status) {
        return response.data;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editCustomer = createAsyncThunk(
  'order/editCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Append all customer data to formData
      Object.entries(customerData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await AxiosInstance.post('/edit_customers_api', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to update customer');
      }
    } catch (error) {
      console.error('Edit Customer Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update customer');
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
  customerFormData: {
    customers_groups: [],
    currencies: [],
    countries: [],
    languages: []
  },
  customerFormDataLoading: false,
  customerFormDataError: null,
  addCustomerLoading: false,
  addCustomerSuccess: false,
  addCustomerError: null,
  editCustomerLoading: false,
  editCustomerSuccess: false,
  editCustomerError: null,
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
    resetAddCustomerState: state => {
      state.addCustomerLoading = false;
      state.addCustomerSuccess = false;
      state.addCustomerError = null;
    },
    resetEditCustomerState: state => {
      state.editCustomerLoading = false;
      state.editCustomerSuccess = false;
      state.editCustomerError = null;
    },
  },
  extraReducers: builder => {
    // Fetch Upcoming Orders
    builder
      .addCase(fetchUpcomingOrders.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchUpcomingOrders.rejected, (state, action) => {
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

    // Add new cases for customer form data
    builder
      .addCase(fetchCustomerFormData.pending, state => {
        state.customerFormDataLoading = true;
        state.customerFormDataError = null;
      })
      .addCase(fetchCustomerFormData.fulfilled, (state, action) => {
        state.customerFormDataLoading = false;
        state.customerFormData = action.payload;
        state.customerFormDataError = null;
      })
      .addCase(fetchCustomerFormData.rejected, (state, action) => {
        state.customerFormDataLoading = false;
        state.customerFormDataError = action.payload;
      });

    // Add Customer cases
    builder
      .addCase(addCustomer.pending, state => {
        state.addCustomerLoading = true;
        state.addCustomerSuccess = false;
        state.addCustomerError = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.addCustomerLoading = false;
        state.addCustomerSuccess = true;
        state.addCustomerError = null;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.addCustomerLoading = false;
        state.addCustomerSuccess = false;
        state.addCustomerError = action.payload;
      });

    // Add Edit Customer cases
    builder
      .addCase(editCustomer.pending, state => {
        state.editCustomerLoading = true;
        state.editCustomerSuccess = false;
        state.editCustomerError = null;
      })
      .addCase(editCustomer.fulfilled, (state, action) => {
        state.editCustomerLoading = false;
        state.editCustomerSuccess = true;
        state.editCustomerError = null;
        // Update the customer in the customers list
        const updatedCustomer = action.payload.data;
        const index = state.customers.findIndex(c => c.id === updatedCustomer.id);
        if (index !== -1) {
          state.customers[index] = {
            ...state.customers[index],
            ...updatedCustomer,
            id: updatedCustomer.id,
            name: updatedCustomer.company,
            phone: updatedCustomer.phonenumber,
            billing: {
              street: updatedCustomer.billing_street,
              city: updatedCustomer.billing_city,
              state: updatedCustomer.billing_state,
              zip: updatedCustomer.billing_zip,
              country: updatedCustomer.billing_country
            },
            shipping: {
              street: updatedCustomer.shipping_street,
              city: updatedCustomer.shipping_city,
              state: updatedCustomer.shipping_state,
              zip: updatedCustomer.shipping_zip,
              country: updatedCustomer.shipping_country
            }
          };
        }
      })
      .addCase(editCustomer.rejected, (state, action) => {
        state.editCustomerLoading = false;
        state.editCustomerSuccess = false;
        state.editCustomerError = action.payload;
      });
  },
});

export const { resetOrderState, resetAddCustomerState, resetEditCustomerState } = orderSlice.actions;

export default orderSlice.reducer;
