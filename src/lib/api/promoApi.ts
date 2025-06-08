import axiosInstance from '@/lib/utils/axiosInstance';
import { PromoCode, PromoCodePayload, PromoCodeDeletePayload } from '@/lib/types/promo';
import { ApiResponse } from '@/lib/types/common';

export const fetchPromoCodes = async (): Promise<PromoCode[]> => {
  const response = await axiosInstance.get<ApiResponse<PromoCode>>('/promo-code/list');
  return response.data.datas || [];
};

export const createPromoCode = async (payload: PromoCodePayload): Promise<PromoCode> => {
  const response = await axiosInstance.post<ApiResponse<PromoCode>>('/promo-code/create', payload);
  return response.data.data!;
};

export const updatePromoCode = async (id: string, payload: PromoCodePayload): Promise<PromoCode> => {
  const response = await axiosInstance.post<ApiResponse<PromoCode>>(`/promo-code/${id}/edit`, payload);
  return response.data.data!;
};

export const deletePromoCode = async (id: string, payload: PromoCodeDeletePayload): Promise<void> => {
  await axiosInstance.post(`/promo-code/${id}/delete`, payload);
};