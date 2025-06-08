import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { fetchProductDiscounts, createProductDiscount, updateProductDiscount, deleteProductDiscount, fetchOrderDiscounts, createOrderDiscount, updateOrderDiscount, deleteOrderDiscount } from '@/lib/api/discountApi';
import { ProductDiscount, ProductDiscountPayload, OrderDiscount, OrderDiscountPayload, DiscountDeletePayload } from '@/lib/types/discount';
import { DiscountType } from '@/lib/types/common';

interface DiscountState {
  productDiscounts: ProductDiscount[];
  orderDiscounts: OrderDiscount[];
  loading: boolean;
  error: string | null;
}

const initialState: DiscountState = {
  productDiscounts: [
    {
      id: uuidv4(),
      productId: '',
      product: 'Loading...',
      discountType: DiscountType.Percentage,
      value: 0,
      startDate: '',
      endDate: '',
    },
  ],
  orderDiscounts: [
    {
      id: uuidv4(),
      code: 'Loading...',
      discountType: DiscountType.Flat,
      value: 0,
      minOrderTotal: 0,
      startDate: '',
      endDate: '',
      isActive: false,
      usageLimit: 0,
      storeId: '',
    },
  ],
  loading: false,
  error: null,
};

export const fetchProductDiscountsThunk = createAsyncThunk('discount/fetchProductDiscounts', async (_, { rejectWithValue }) => {
  try {
    return await fetchProductDiscounts();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const createProductDiscountThunk = createAsyncThunk('discount/createProductDiscount', async (payload: ProductDiscountPayload[], { rejectWithValue }) => {
  try {
    return await createProductDiscount(payload);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateProductDiscountThunk = createAsyncThunk('discount/updateProductDiscount', async ({ id, payload }: { id: string; payload: ProductDiscountPayload[] }, { rejectWithValue }) => {
  try {
    return await updateProductDiscount(id, payload);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteProductDiscountThunk = createAsyncThunk('discount/deleteProductDiscount', async ({ id, payload }: { id: string; payload: DiscountDeletePayload }, { rejectWithValue }) => {
  try {
    await deleteProductDiscount(id, payload);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchOrderDiscountsThunk = createAsyncThunk('discount/fetchOrderDiscounts', async (_, { rejectWithValue }) => {
  try {
    return await fetchOrderDiscounts();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const createOrderDiscountThunk = createAsyncThunk('discount/createOrderDiscount', async (payload: OrderDiscountPayload, { rejectWithValue }) => {
  try {
    return await createOrderDiscount(payload);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateOrderDiscountThunk = createAsyncThunk('discount/updateOrderDiscount', async ({ id, payload }: { id: string; payload: OrderDiscountPayload }, { rejectWithValue }) => {
  try {
    return await updateOrderDiscount(id, payload);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteOrderDiscountThunk = createAsyncThunk('discount/deleteOrderDiscount', async ({ id, payload }: { id: string; payload: DiscountDeletePayload }, { rejectWithValue }) => {
  try {
    await deleteOrderDiscount(id, payload);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const discountSlice = createSlice({
  name: 'discount',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDiscountsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDiscountsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.productDiscounts = action.payload;
      })
      .addCase(fetchProductDiscountsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProductDiscountThunk.fulfilled, (state, action) => {
        state.productDiscounts.push(action.payload);
      })
      .addCase(updateProductDiscountThunk.fulfilled, (state, action) => {
        const index = state.productDiscounts.findIndex((disc) => disc.id === action.payload.id);
        if (index !== -1) {
          state.productDiscounts[index] = action.payload;
        }
      })
      .addCase(deleteProductDiscountThunk.fulfilled, (state, action) => {
        state.productDiscounts = state.productDiscounts.filter((disc) => disc.id !== action.payload);
      })
      .addCase(fetchOrderDiscountsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDiscountsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDiscounts = action.payload;
      })
      .addCase(fetchOrderDiscountsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrderDiscountThunk.fulfilled, (state, action) => {
        state.orderDiscounts.push(action.payload);
      })
      .addCase(updateOrderDiscountThunk.fulfilled, (state, action) => {
        const index = state.orderDiscounts.findIndex((disc) => disc.id === action.payload.id);
        if (index !== -1) {
          state.orderDiscounts[index] = action.payload;
        }
      })
      .addCase(deleteOrderDiscountThunk.fulfilled, (state, action) => {
        state.orderDiscounts = state.orderDiscounts.filter((disc) => disc.id !== action.payload);
      });
  },
});

export default discountSlice.reducer;