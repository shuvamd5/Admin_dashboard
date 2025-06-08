import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as apiLogin, register as apiRegister, registerCustomer as apiRegisterCustomer, forgotPassword as apiForgotPassword, resetPassword as apiResetPassword, getStores as apiGetStores } from '@/lib/api/authApi';
import { LoginPayload, RegisterPayload, CustomerRegisterPayload, ForgotPasswordPayload, ResetPasswordPayload, Store } from '@/lib/types/auth';

interface AuthState {
  token: string | null;
  storeId: string | null;
  stores: Store[];
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  token: null,
  storeId: null,
  stores: [],
  loading: false,
  error: null,
  message: null,
};

export const login = createAsyncThunk('auth/login', async (payload: LoginPayload, { rejectWithValue }) => {
  try {
    const response = await apiLogin(payload);
    localStorage.setItem('token', response.token);
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const register = createAsyncThunk('auth/register', async (payload: RegisterPayload, { rejectWithValue }) => {
  try {
    const response = await apiRegister({
      ...payload,
      isStaff: true,
      isCustomer: false,
      dateJoined: new Date().toISOString().split('T')[0],
    });
    localStorage.setItem('token', response.token);
    if (response.storeId) {
      localStorage.setItem('storeId', response.storeId);
    }
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const registerCustomer = createAsyncThunk('auth/registerCustomer', async (payload: CustomerRegisterPayload, { rejectWithValue }) => {
  try {
      const response = await apiRegisterCustomer(payload);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
});

export const getStores = createAsyncThunk('auth/getStores', async (_, { rejectWithValue }) => {
  try {
    const response = await apiGetStores();
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (payload: ForgotPasswordPayload, { rejectWithValue }) => {
  try {
    const response = await apiForgotPassword(payload);
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (payload: ResetPasswordPayload, { rejectWithValue }) => {
  try {
    const response = await apiResetPassword(payload);
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.storeId = null;
      state.stores = [];
      localStorage.removeItem('token');
      localStorage.removeItem('storeId');
    },
    clearMessage: (state) => {
      state.message = null;
    },
    bypassLogin: (state) => {
      state.token = 'mock-token-dev';
      state.storeId = 'mock-store-id-1';
      state.loading = false;
      state.error = null;
      localStorage.setItem('token', 'mock-token-dev');
      localStorage.setItem('storeId', 'mock-store-id-1');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.storeId = action.payload.storeId || null;
        state.message = action.payload.responseMessage;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.responseMessage;
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(getStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.responseMessage;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.responseMessage;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearMessage, bypassLogin } = authSlice.actions;
export default authSlice.reducer;
