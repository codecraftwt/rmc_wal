// Redux/slices/authSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AxiosInstance from '../../Utils/AxoisInstance';
import {removeToken, setToken, getToken} from '../storage/Storage';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      formData.append('email', payload.email);
      formData.append('password', payload.password);

      const response = await AxiosInstance.post('/login_api', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;

      if (data?.status && data?.token) {
        await setToken(data.token);
        return {
          token: data.token,
          message: data.message,
        };
      } else {
        return rejectWithValue(data.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      removeToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;
