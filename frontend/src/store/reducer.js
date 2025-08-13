import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import logger from 'redux-logger';
import customizationReducer from './customizationReducer';
import adminLoginReducer from './modules/adminLogin/adminLoginSlice';

// Combine reducers
const reducer = combineReducers({
  adminLogin: adminLoginReducer,
  customization: customizationReducer
});

// Configure store with combined reducers
export const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});

const useAppDispatch = () => store.dispatch;
export { useAppDispatch };

export default reducer;
