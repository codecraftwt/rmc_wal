import { combineReducers } from 'redux';
import authReducer from '../slices/authSlice';
import materialInwardReducer from '../slices/materialInwardSlice';
import addOrderReducer from '../slices/addOrderSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  materialInward: materialInwardReducer,
  order: orderReducer,
});
