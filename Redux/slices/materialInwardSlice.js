import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '../../Utils/AxoisInstance'
import { baseURL } from '../../Utils/api';

export const fetchMaterialInward = createAsyncThunk(
  'materialInward/fetchMaterialInward',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`${baseURL}/material_inwards_api`);
      if (response.data.status) {
        return response.data.data;
  
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch data');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network Error');
    }
  }
);

const materialInwardSlice = createSlice({
  name: 'materialInward',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMaterialData: (state) => {
      state.data = [];
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMaterialInward.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterialInward.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMaterialInward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMaterialData } = materialInwardSlice.actions;
export default materialInwardSlice.reducer;
