import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import modalConnectSlice from './slices/modalConnectSlice';
import storage from 'redux-persist/lib/storage';
import errorNetWorkSlice from './slices/errorNetWorkSlice';
import authSlice from './slices/authSlice';
import modalTxSlice from './slices/modalWaitingTx';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [],
};

const rootReducer = combineReducers({
  modalConnectSlice: modalConnectSlice,
  errorNetworkSlice: errorNetWorkSlice,
  authSlice: authSlice,
  modalTxSlice: modalTxSlice,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
