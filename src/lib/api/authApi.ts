import axiosInstance from '@/lib/utils/axiosInstance';
import { LoginPayload, RegisterPayload, CustomerRegisterPayload, LoginResponse, CustomerRegisterResponse, ForgotPasswordPayload, ResetPasswordPayload, ApiResponse, Store } from '@/lib/types/auth';

export const login = async (credentials: LoginPayload): Promise<LoginResponse> => {
  const authHeader = `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
  const response = await axiosInstance.post<LoginResponse>('/login', credentials, {
    headers: {
      Authorization: authHeader,
      [process.env.API_KEY || 'a7c136d2ebe03341d9bc2920b9247cb9c9']: '',
    },
  });
  return response.data;
};

export const register = async (payload: RegisterPayload): Promise<LoginResponse> => {
  if (process.env.NODE_ENV === 'development') {
    return {
      responseCode: '000',
      responseMessage: 'Store registered successfully',
      token: 'mock-token-store-' + Date.now(),
      storeId: 'mock-store-id-' + Date.now(),
    };
  }
  const response = await axiosInstance.post<LoginResponse>('/register', payload, {
    headers: {
      [process.env.API_KEY || 'a7c136d2ebe03341d9bc2920b9247cb9c9']: '',
    },
  });
  return response.data;
};

export const registerCustomer = async (payload: CustomerRegisterPayload): Promise<CustomerRegisterResponse> => {
  if (process.env.NODE_ENV === 'development') {
    return {
      responseCode: '000',
      responseMessage: 'Customer registered successfully',
      customerId: 'mock-customer-id-' + Date.now(),
    };
  }
  const response = await axiosInstance.post<CustomerRegisterResponse>('/customer/register', payload, {
    headers: {
      [process.env.API_KEY || 'a7c136d2ebe03341d9bc2920b9247cb9c9']: '',
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getStores = async (): Promise<Store[]> => {
  if (process.env.NODE_ENV === 'development') {
    return [
      { storeId: 'mock-store-id-1', storeName: 'Map Fashion' },
      { storeId: 'mock-store-id-2', storeName: 'Trendy Threads' },
      { storeId: 'mock-store-id-3', storeName: 'Style Hub' },
    ];
  }
  const response = await axiosInstance.get<Store[]>('/stores', {
    headers: {
      [process.env.API_KEY || 'a7c136d2ebe03341d9bc2920b9247cb9c9']: '',
    },
  });
  return response.data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<ApiResponse> => {
  const response = await axiosInstance.post<ApiResponse>('/forgot-password', payload, {
    headers: {
      [process.env.API_KEY || 'a7c136d2ebe03341d9bc2920b9247cb9c9']: '',
    },
  });
  return response.data;
};

export const resetPassword = async (payload: ResetPasswordPayload): Promise<ApiResponse> => {
  const response = await axiosInstance.post<ApiResponse>('/reset-password', payload, {
    headers: {
      [process.env.API_KEY || 'a7c136d2ebe03341d9bc2920b9247cb9c9']: '',
    },
  });
  return response.data;
};