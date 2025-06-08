import axiosInstance from '@/lib/utils/axiosInstance';
import { VariantType, VariantValue, VariantTypePayload, VariantValuePayload, DeletePayload } from '@/lib/types/variant';
import { ApiResponse } from '@/lib/types/common';

export const fetchVariantTypes = async (): Promise<VariantType[]> => {
  const response = await axiosInstance.get<ApiResponse<VariantType>>('/variant-type/list');
  return response.data.datas ?? [];
};

export const createVariantType = async (payload: VariantTypePayload): Promise<VariantType> => {
  const response = await axiosInstance.post<ApiResponse<VariantType>>('/variant-type/create', payload);
  return response.data.data!;
};

export const updateVariantType = async (id: string, payload: VariantTypePayload): Promise<VariantType> => {
  const response = await axiosInstance.post<ApiResponse<VariantType>>(`/variant-type/${id}/edit`, payload);
  return response.data.data!;
};

export const deleteVariantType = async (id: string, payload: DeletePayload): Promise<void> => {
  await axiosInstance.post<ApiResponse<void>>(`/variant-type/${id}/delete`, payload);
};

export const fetchVariantValues = async (): Promise<VariantValue[]> => {
  const response = await axiosInstance.get<ApiResponse<VariantValue>>('/variant-value/list');
  return response.data.datas ?? [];
};

export const createVariantValue = async (payload: VariantValuePayload): Promise<VariantValue> => {
  const response = await axiosInstance.post<ApiResponse<VariantValue>>('/variant-value/create', payload);
  return response.data.data!;
};

export const updateVariantValue = async (id: string, payload: VariantValuePayload): Promise<VariantValue> => {
  const response = await axiosInstance.post<ApiResponse<VariantValue>>(`/variant-value/${id}/edit`, payload);
  return response.data.data!;
};

export const deleteVariantValue = async (id: string, payload: DeletePayload): Promise<void> => {
  await axiosInstance.post<ApiResponse<void>>(`/variant-value/${id}/delete`, payload);
};