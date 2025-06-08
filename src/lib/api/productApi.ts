import axiosInstance from '@/lib/utils/axiosInstance';
import { Product, ProductPayload } from '@/lib/types/product';
import { ApiResponse } from '@/lib/types/common';

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get<ApiResponse<Product>>('/product/list');
  return response.data.datas || [];
};

export const createProduct = async (payload: ProductPayload): Promise<Product> => {
  const response = await axiosInstance.post<ApiResponse<Product>>('/product/create', payload);
  return response.data.data!;
};

export const updateProduct = async (id: string, payload: ProductPayload): Promise<Product> => {
  const response = await axiosInstance.post<ApiResponse<Product>>(`/product/${id}/edit`, payload);
  return response.data.data!;
};

export const deleteProduct = async (id: string, payload: { voidRemarks: string }): Promise<void> => {
  await axiosInstance.post(`/product/${id}/delete`, payload);
};