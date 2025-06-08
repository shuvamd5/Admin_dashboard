import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/utils/axiosInstance';
import { Category, CategoryPayload, CategoryDeletePayload } from '@/lib/types/category';
import { ApiResponse } from '@/lib/types/common';
import { v4 as uuidv4 } from 'uuid';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [
    { id: uuidv4(), category: 'Loading...', url: '', altText: 'Placeholder' },
  ],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk('category/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<Category>>('/category/list');
    return response.data.datas || [];
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const createCategory = createAsyncThunk('category/createCategory', async (payload: CategoryPayload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ApiResponse<Category>>('/category/create', payload);
    return response.data.data!;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateCategory = createAsyncThunk('category/updateCategory', async ({ id, payload }: { id: string; payload: CategoryPayload }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ApiResponse<Category>>(`/category/${id}/edit`, payload);
    return response.data.data!;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteCategory = createAsyncThunk('category/deleteCategory', async ({ id, payload }: { id: string; payload: CategoryDeletePayload }, { rejectWithValue }) => {
  try {
    await axiosInstance.post(`/category/${id}/delete`, payload);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((cat) => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((cat) => cat.id !== action.payload);
      });
  },
});

export default categorySlice.reducer;