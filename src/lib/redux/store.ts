import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice'
import customerReducer from './slices/customerSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import variantReducer from './slices/variantSlice';
import tagReducer from './slices/tagSlice';
import discountReducer from './slices/discountSlice';
import reviewReducer from './slices/reviewSlice';
import orderReducer from './slices/orderSlice';
import promoReducer from './slices/promoSlice';
import selectionReducer from './slices/selectionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    customer: customerReducer,
    category: categoryReducer,
    product: productReducer,
    variant: variantReducer,
    tag: tagReducer,
    discount: discountReducer,
    review: reviewReducer,
    order: orderReducer,
    promo: promoReducer,
    selection: selectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;