import axiosInstance from '@/lib/utils/axiosInstance';
import { Customer, CustomerRegisterPayload } from '@/lib/types/customer';
import { ApiResponse } from '@/lib/types/common';

export const fetchCustomers = async (): Promise<Customer[]> => {
  const response = await axiosInstance.get<ApiResponse<Customer>>('/customer/list');
  return response.data.datas || [];
};

export const fetchCustomer = async (id: string): Promise<Customer> => {
  const response = await axiosInstance.get<ApiResponse<Customer>>(`/customer/${id}/profile`);
  return response.data.data!;
};

export const createCustomer = async (payload: CustomerRegisterPayload): Promise<Customer> => {
  const response = await axiosInstance.post<ApiResponse<Customer>>('/customer/register', payload);
  return response.data.data!;
};

export const updateCustomer = async (id: string, payload: CustomerRegisterPayload): Promise<Customer> => {
  const response = await axiosInstance.post<ApiResponse<Customer>>(`/customer/${id}/edit`, payload);
  return response.data.data!;
};

export const deleteCustomer = async (id: string, payload: { voidRemarks: string }): Promise<void> => {
  await axiosInstance.post(`/customer/${id}/delete`, payload);
};