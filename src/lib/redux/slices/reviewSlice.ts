import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProductReviews, createProductReview, updateProductReview, deleteProductReview } from '@/lib/api/reviewApi';
import { ProductReview, ProductReviewPayload, ProductReviewDeletePayload } from '@/lib/types/review';

interface ReviewState {
  reviews: ProductReview[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

export const fetchProductReviewsThunk = createAsyncThunk('review/fetchProductReviews', async (productId: string, { rejectWithValue }) => {
  try {
    return await fetchProductReviews(productId);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const createProductReviewThunk = createAsyncThunk('review/createProductReview', async (payload: ProductReviewPayload, { rejectWithValue }) => {
  try {
    return await createProductReview(payload);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateProductReviewThunk = createAsyncThunk('review/updateProductReview', async ({ id, payload }: { id: string; payload: ProductReviewPayload }, { rejectWithValue }) => {
  try {
    return await updateProductReview(id, payload);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteProductReviewThunk = createAsyncThunk('review/deleteProductReview', async ({ id, payload }: { id: string; payload: ProductReviewDeletePayload }, { rejectWithValue }) => {
  try {
    await deleteProductReview(id, payload);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReviewsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviewsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchProductReviewsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProductReviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createProductReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProductReviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reviews.findIndex((rev) => rev.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(updateProductReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProductReviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter((rev) => rev.id !== action.payload);
      })
      .addCase(deleteProductReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default reviewSlice.reducer;