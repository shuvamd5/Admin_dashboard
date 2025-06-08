import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer, fetchCustomer } from '@/lib/api/customerApi';
import { Customer, CustomerRegisterPayload } from '@/lib/types/customer';

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [
    {
      id: uuidv4(),
      firstName: 'Loading...',
      lastName: '',
      email: '',
      mobileNumber: '',
      isSubscribed: false,
    },
  ],
  loading: false,
  error: null,
};

export const fetchCustomersThunk = createAsyncThunk('customer/fetchCustomers', async (_, { rejectWithValue }) => {
  try {
    return await fetchCustomers();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchCustomerThunk = createAsyncThunk('customer/fetchCustomer', async (id: string, { rejectWithValue }) => {
  try {
    return await fetchCustomer(id);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const createCustomerThunk = createAsyncThunk('customer/createCustomer', async (payload: CustomerRegisterPayload, { rejectWithValue }) => {
  try {
    return await createCustomer(payload);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateCustomerThunk = createAsyncThunk('customer/updateCustomer', async ({ id, payload }: { id: string; payload: CustomerRegisterPayload }, { rejectWithValue }) => {
  try {
    return await updateCustomer(id, payload);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteCustomerThunk = createAsyncThunk('customer/deleteCustomer', async ({ id, payload }: { id: string; payload: { voidRemarks: string } }, { rejectWithValue }) => {
  try {
    await deleteCustomer(id, payload);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCustomerThunk.fulfilled, (state, action) => {
        const index = state.customers.findIndex((cust) => cust.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        } else {
          state.customers.push(action.payload);
        }
      })
      .addCase(createCustomerThunk.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      .addCase(updateCustomerThunk.fulfilled, (state, action) => {
        const index = state.customers.findIndex((cust) => cust.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(deleteCustomerThunk.fulfilled, (state, action) => {
        state.customers = state.customers.filter((cust) => cust.id !== action.payload);
      });
  },
});

export default customerSlice.reducer;