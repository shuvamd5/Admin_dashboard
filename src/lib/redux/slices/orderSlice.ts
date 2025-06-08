import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchOrders, fetchOrderItems, createOrder } from '@/lib/api/orderApi';
import { Order, OrderItem, OrderPayload } from '@/lib/types/order';

interface OrderState {
  orders: Order[];
  orderItems: { [orderId: string]: OrderItem[] };
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  orderItems: {},
  loading: false,
  error: null,
};

export const fetchOrdersThunk = createAsyncThunk('order/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    return await fetchOrders();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchOrderItemsThunk = createAsyncThunk('order/fetchOrderItems', async (orderId: string, { rejectWithValue }) => {
  try {
    const items = await fetchOrderItems(orderId);
    return { orderId, items };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const createOrderThunk = createAsyncThunk('order/createOrder', async (payload: OrderPayload, { rejectWithValue }) => {
  try {
    return await createOrder(payload);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderItemsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderItemsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderItems[action.payload.orderId] = action.payload.items;
      })
      .addCase(fetchOrderItemsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;