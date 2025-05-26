import { combineReducers } from 'redux';
import authReducer from '../slices/authSlice';
import materialInwardReducer from '../slices/materialInwardSlice';
import orderReducer from '../slices/orderSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  materialInward: materialInwardReducer,
  order: orderReducer,
  // add more reducers here
});
