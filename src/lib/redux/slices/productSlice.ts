import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/utils/axiosInstance';
import { Product, ProductPayload, DeletePayload } from '@/lib/types/product';
import { v4 as uuidv4 } from 'uuid';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [
    {
      id: uuidv4(),
      url: '',
      alt_text: 'Placeholder',
      product: 'Loading...',
      category: '',
      price: 0,
      remaining_stock: 0,
    },
  ],
  loading: false,
  error: null,
};

export const fetchProductsThunk = createAsyncThunk('product/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          id: '731b7d3ea2e4b378b446ed78f1fbab0',
          url: 'https://example.com/images/tshirt-front.jpg',
          alt_text: 'Front view of Classic T-Shirt',
          product: 'Classic T-Shirt',
          category: 'Dress',
          price: 29.98,
          remaining_stock: 156,
        },
      ];
    }
    const response = await axiosInstance.get('/product/list', {
      headers: { Authorization: `Token a7c1363d2ebe203341db98c292805b924a7cbc98` },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const createProductThunk = createAsyncThunk('product/createProduct', async (payload: ProductPayload, { rejectWithValue }) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      const newProduct: Product = {
        id: `mock-${uuidv4()}`,
        url: payload.productImages[0]?.url || '',
        alt_text: payload.productImages[0]?.altText || '',
        product: payload.product.title,
        category: payload.category.categoryId,
        price: payload.product.price,
        remaining_stock: payload.product.stockQuantity,
      };
      return newProduct;
    }
    const response = await axiosInstance.post('/product/create', payload, {
      headers: { Authorization: `Token a7c1363d2ebe203341db98c292805b924a7cbc98` },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateProductThunk = createAsyncThunk('product/updateProduct', async ({ id, payload }: { id: string; payload: ProductPayload }, { rejectWithValue }) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      const updatedProduct: Product = {
        id,
        url: payload.productImages[0]?.url || '',
        alt_text: payload.productImages[0]?.altText || '',
        product: payload.product.title,
        category: payload.category.categoryId,
        price: payload.product.price,
        remaining_stock: payload.product.stockQuantity,
      };
      return updatedProduct;
    }
    const response = await axiosInstance.post(`/product/${id}/edit`, payload, {
      headers: { Authorization: `Token a7c1363d2ebe203341db98c292805b924a7cbc98` },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteProductThunk = createAsyncThunk('product/deleteProduct', async ({ id, payload }: { id: string; payload: DeletePayload }, { rejectWithValue }) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return id;
    }
    await axiosInstance.post(`/product/${id}/delete`, payload, {
      headers: { Authorization: `Token a7c1363d2ebe203341db98c292805b924a7cbc98` },
    });
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex((prod) => prod.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter((prod) => prod.id !== action.payload);
      });
  },
});

export default productSlice.reducer;