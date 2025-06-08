import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectionState {
  selectedCategoryId: string | null;
  selectedProductId: string | null;
  selectedVariantTypeId: string | null;
}

const initialState: SelectionState = {
  selectedCategoryId: null,
  selectedProductId: null,
  selectedVariantTypeId: null,
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelectedCategoryId(state, action: PayloadAction<string | null>) {
      state.selectedCategoryId = action.payload;
      state.selectedProductId = null; // Reset product when category changes
      state.selectedVariantTypeId = null; // Reset variant type
    },
    setSelectedProductId(state, action: PayloadAction<string | null>) {
      state.selectedProductId = action.payload;
      state.selectedVariantTypeId = null; // Reset variant type when product changes
    },
    setSelectedVariantTypeId(state, action: PayloadAction<string | null>) {
      state.selectedVariantTypeId = action.payload;
    },
  },
});

export const { setSelectedCategoryId, setSelectedProductId, setSelectedVariantTypeId } = selectionSlice.actions;
export default selectionSlice.reducer;