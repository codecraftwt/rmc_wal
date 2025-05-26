import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { rootReducer } from '../reducers/index'; 
import { storage } from '../storage/Storage';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['error', 'status', 'loader'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false, 
  }),
});

export const persistor = persistStore(store);