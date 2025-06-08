import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/utils/axiosInstance';
import { VariantType, VariantValue, VariantTypePayload, VariantValuePayload, DeletePayload } from '@/lib/types/variant';

interface VariantState {
  variantTypes: VariantType[];
  variantValues: VariantValue[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VariantState = {
  variantTypes: [],
  variantValues: [],
  loading: 'idle',
  error: null,
};

export const fetchVariantTypesThunk = createAsyncThunk('variant/fetchVariantTypes', async () => {
  if (process.env.NODE_ENV === 'development') {
    return [
      { id: 'e2706aa078844e3ba6a08fb79eedf3d', variantType: 'Size' },
      { id: 'aede62479564c374e4588795ale50eb', variantType: 'Color' },
    ];
  }
  const response = await axiosInstance.get('/variant-type/list', {
    headers: { Authorization: `Token ${process.env.API_TOKEN || 'a7c1363d2ebe203341db98c292805b924a7cbc98'}` },
  });
  return response.data.datas;
});

export const fetchVariantValuesThunk = createAsyncThunk('variant/fetchVariantValues', async () => {
  if (process.env.NODE_ENV === 'development') {
    return [
      { id: '5f258476212346df9048bc8f7bac7d00', variantTypeId: 'e2706aa078844e3ba6a08fb79eedf3d', variantName: 'Long' },
      { id: '7109ff17e300494c811e8ed8f2290073', variantTypeId: 'e2706aa078844e3ba6a08fb79eedf3d', variantName: 'Small' },
    ];
  }
  const response = await axiosInstance.get('/variant-value/list', {
    headers: { Authorization: `Token ${process.env.API_TOKEN || 'a7c1363d2ebe203341db98c292805b924a7cbc98'}` },
  });
  return response.data.datas;
});

export const createVariantTypeThunk = createAsyncThunk('variant/createVariantType', async (payload: VariantTypePayload) => {
  if (process.env.NODE_ENV === 'development') {
    const newType: VariantType = {
      id: `mock-${Math.random().toString(36).substr(2, 9)}`,
      variantType: payload.variantType,
    };
    return newType;
  }
  const response = await axiosInstance.post('/variant-type/create', payload, {
    headers: { Authorization: `Token ${process.env.API_TOKEN || 'a7c1363d2ebe203341db98c292805b924a7cbc98'}` },
  });
  return response.data.data;
});

export const updateVariantTypeThunk = createAsyncThunk('variant/updateVariantType', async ({ id, payload }: { id: string; payload: VariantTypePayload }) => {
  if (process.env.NODE_ENV === 'development') {
    return { id, variantType: payload.variantType };
  }
  const response = await axiosInstance.post(`/variant-type/${id}/edit`, payload, {
    headers: { Authorization: `Token ${process.env.API_TOKEN || 'a7c1363d2ebe203341db98c292805b924a7cbc98'}` },
  });
  return response.data.data;
});

export const deleteVariantTypeThunk = createAsyncThunk('variant/deleteVariantType', async ({ id, payload }: { id: string; payload: DeletePayload }) => {
  if (process.env.NODE_ENV === 'development') {
    return id;
  }
  await axiosInstance.post(`/variant-type/${id}/delete`, payload, {
    headers: { Authorization: `Token ${process.env.API_TOKEN || 'a7c1363d2ebe203341db98c292805b924a7cbc98'}` },
  });
  return id;
});

export const createVariantValueThunk = createAsyncThunk('variant/createVariantValue', async (payload: VariantValuePayload) => {
  if (process.env.NODE_ENV === 'development') {
    const newValue: VariantValue = {
      id: `mock-${Math.random().toString(36).substr(2, 9)}`,
      variantTypeId: payload.variantTypeId,
      variantName: payload.variantName,
    };
    return newValue;
  }
  const response = await axiosInstance.post('/variant-value/create', payload, {
    headers: { Authorization: `Token ${process.env.API_TOKEN || 'a7c1363d2ebe203341db98c292805b924a7cbc98'}` },
  });
  return response.data.data;
});

export const updateVariantValueThunk = createAsyncThunk('variant/updateVariantValue', async ({ id, payload }: { id: string; payload: VariantValuePayload }) => {
  if (process.env.NODE_ENV === 'development') {
    return { id, ...payload };
  }
  const response = await axiosInstance.post(`/variant-value/${id}/edit`, payload, {
    headers: { Authorization: `Token ${process.env.API_TOKEN || 'a7c1363d2ebe203341db98c292805b924a7cbc98'}` },
  });
  return response.data.data;
});

export const deleteVariantValueThunk = createAsyncThunk('variant/deleteVariantValue', async ({ id, payload }: { id: string; payload: DeletePayload }) => {
  if (process.env.NODE_ENV === 'development') {
    return id;
  }
  await axiosInstance.post(`/variant-value/${id}/delete`, payload, {
    headers: { Authorization: `Token ${process.env.API_TOKEN || 'a7c1363d2ebe203341db98c292805b924a7cbc98'}` },
  });
  return id;
});

const variantSlice = createSlice({
  name: 'variant',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVariantTypesThunk.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchVariantTypesThunk.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.variantTypes = action.payload;
      })
      .addCase(fetchVariantTypesThunk.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch variant types';
      })
      .addCase(fetchVariantValuesThunk.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchVariantValuesThunk.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.variantValues = action.payload;
      })
      .addCase(fetchVariantValuesThunk.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch variant values';
      })
      .addCase(createVariantTypeThunk.fulfilled, (state, action) => {
        state.variantTypes.push(action.payload);
      })
      .addCase(updateVariantTypeThunk.fulfilled, (state, action) => {
        const index = state.variantTypes.findIndex((vt) => vt.id === action.payload.id);
        if (index !== -1) {
          state.variantTypes[index] = action.payload;
        }
      })
      .addCase(deleteVariantTypeThunk.fulfilled, (state, action) => {
        state.variantTypes = state.variantTypes.filter((vt) => vt.id !== action.payload);
      })
      .addCase(createVariantValueThunk.fulfilled, (state, action) => {
        state.variantValues.push(action.payload);
      })
      .addCase(updateVariantValueThunk.fulfilled, (state, action) => {
        const index = state.variantValues.findIndex((vv) => vv.id === action.payload.id);
        if (index !== -1) {
          state.variantValues[index] = action.payload;
        }
      })
      .addCase(deleteVariantValueThunk.fulfilled, (state, action) => {
        state.variantValues = state.variantValues.filter((vv) => vv.id !== action.payload);
      });
  },
});

export default variantSlice.reducer;