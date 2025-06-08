// src/lib/redux/slices/promoSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { fetchPromoCodes, createPromoCode, updatePromoCode, deletePromoCode } from '@/lib/api/promoApi';
import { PromoCode, PromoCodePayload, PromoCodeDeletePayload } from '@/lib/types/promo';
import { DiscountType } from '@/lib/types/common';

interface PromoCodeState {
  promoCodes: PromoCode[];
  loading: boolean;
  error: string | null;
}

const initialState: PromoCodeState = {
  promoCodes: [
    {
      id: uuidv4(),
      code: 'Loading...',
      description: '',
      discountType: DiscountType.Percentage,
      value: 0,
      minOrderTotal: 0,
      startDate: '',
      endDate: '',
      isActive: false,
      usageLimit: 0,
      timesUsed: 0,
      storeId: '',
    },
  ],
  loading: false,
  error: null,
};

export const fetchPromoCodesThunk = createAsyncThunk('promo/fetchPromoCodes', async (_, { rejectWithValue }) => {
  try {
    return await fetchPromoCodes();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const createPromoCodeThunk = createAsyncThunk('promo/createPromoCode', async (payload: PromoCodePayload, { rejectWithValue }) => {
  try {
    return await createPromoCode(payload);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updatePromoCodeThunk = createAsyncThunk('promo/updatePromoCode', async ({ id, payload }: { id: string; payload: PromoCodePayload }, { rejectWithValue }) => {
  try {
    return await updatePromoCode(id, payload);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deletePromoCodeThunk = createAsyncThunk('promo/deletePromoCode', async ({ id, payload }: { id: string; payload: PromoCodeDeletePayload }, { rejectWithValue }) => {
  try {
    await deletePromoCode(id, payload);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const promoCodeSlice = createSlice({
  name: 'promo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromoCodesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromoCodesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.promoCodes = action.payload;
      })
      .addCase(fetchPromoCodesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPromoCodeThunk.fulfilled, (state, action) => {
        state.promoCodes.push(action.payload);
      })
      .addCase(updatePromoCodeThunk.fulfilled, (state, action) => {
        const index = state.promoCodes.findIndex((promo) => promo.id === action.payload.id);
        if (index !== -1) {
          state.promoCodes[index] = action.payload;
        }
      })
      .addCase(deletePromoCodeThunk.fulfilled, (state, action) => {
        state.promoCodes = state.promoCodes.filter((promo) => promo.id !== action.payload);
      });
  },
});

export default promoCodeSlice.reducer;