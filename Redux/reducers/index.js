// import { combineReducers } from 'redux';
// import authReducer from '../slices/authSlice';
// import materialInwardReducer from '../slices/materialInwardSlice';
// import addOrderReducer from '../slices/addOrderSlice';
// import orderReducer from '../slices/orderSlice';

// export const rootReducer = combineReducers({
//   auth: authReducer,
//   materialInward: materialInwardReducer,
//   // order: addOrderReducer,
//   orders: orderReducer,
// });



import { combineReducers } from 'redux';
import authReducer from '../slices/authSlice';
import materialInwardReducer from '../slices/materialInwardSlice';
import addOrderReducer from '../slices/addOrderSlice';
import orderReducer from '../slices/orderSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  materialInward: materialInwardReducer,
  order: orderReducer,
  addOrder: addOrderReducer,
});