// src/lib/redux/slices/tagSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { fetchTags, createTag, updateTag, deleteTag } from '@/lib/api/tagApi';
import { Tag, TagPayload, TagDeletePayload } from '@/lib/types/tag';

interface TagState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagState = {
  tags: [
    { id: uuidv4(), tag: 'Loading...' },
  ],
  loading: false,
  error: null,
};

export const fetchTagsThunk = createAsyncThunk('tag/fetchTags', async (_, { rejectWithValue }) => {
  try {
    return await fetchTags();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const createTagThunk = createAsyncThunk('tag/createTag', async (payload: TagPayload, { rejectWithValue }) => {
  try {
    return await createTag(payload);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateTagThunk = createAsyncThunk('tag/updateTag', async ({ id, payload }: { id: string; payload: TagPayload }, { rejectWithValue }) => {
  try {
    return await updateTag(id, payload);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteTagThunk = createAsyncThunk('tag/deleteTag', async ({ id, payload }: { id: string; payload: TagDeletePayload }, { rejectWithValue }) => {
  try {
    await deleteTag(id, payload);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTagsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTagsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTagsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTagThunk.fulfilled, (state, action) => {
        state.tags.push(action.payload);
      })
      .addCase(updateTagThunk.fulfilled, (state, action) => {
        const index = state.tags.findIndex((tag) => tag.id === action.payload.id);
        if (index !== -1) {
          state.tags[index] = action.payload;
        }
      })
      .addCase(deleteTagThunk.fulfilled, (state, action) => {
        state.tags = state.tags.filter((tag) => tag.id !== action.payload);
      });
  },
});

export default tagSlice.reducer;