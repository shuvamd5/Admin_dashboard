import axiosInstance from '@/lib/utils/axiosInstance';
import { Category, CategoryPayload } from '@/lib/types/category';
import { ApiResponse } from '@/lib/types/common';

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<ApiResponse<Category>>('/category/list');
  return response.data.datas || [];
};

export const createCategory = async (payload: CategoryPayload): Promise<Category> => {
  const response = await axiosInstance.post<ApiResponse<Category>>('/category/create', payload);
  return response.data.data!;
};

export const updateCategory = async (id: string, payload: CategoryPayload): Promise<Category> => {
  const response = await axiosInstance.post<ApiResponse<Category>>(`/category/${id}/edit`, payload);
  return response.data.data!;
};

export const deleteCategory = async (id: string, payload: { voidRemarks: string }): Promise<void> => {
  await axiosInstance.post(`/category/${id}/delete`, payload);
};