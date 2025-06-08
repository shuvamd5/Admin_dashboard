import axiosInstance from '@/lib/utils/axiosInstance';
import { ProductDiscount, ProductDiscountPayload, OrderDiscount, OrderDiscountPayload, DiscountDeletePayload } from '@/lib/types/discount';
import { ApiResponse } from '@/lib/types/common';

export const fetchProductDiscounts = async (): Promise<ProductDiscount[]> => {
  const response = await axiosInstance.get<ApiResponse<ProductDiscount>>('/product-discount/list');
  return response.data.datas || [];
};

export const createProductDiscount = async (payload: ProductDiscountPayload[]): Promise<ProductDiscount> => {
  const response = await axiosInstance.post<ApiResponse<ProductDiscount>>('/product-discount/create', payload);
  return response.data.data!;
};

export const updateProductDiscount = async (id: string, payload: ProductDiscountPayload[]): Promise<ProductDiscount> => {
  const response = await axiosInstance.post<ApiResponse<ProductDiscount>>(`/product-discount/${id}/edit`, payload);
  return response.data.data!;
};

export const deleteProductDiscount = async (id: string, payload: DiscountDeletePayload): Promise<void> => {
  await axiosInstance.post(`/product-discount/${id}/delete`, payload);
};

export const fetchOrderDiscounts = async (): Promise<OrderDiscount[]> => {
  const response = await axiosInstance.get<ApiResponse<OrderDiscount>>('/order-discount/list');
  return response.data.datas || [];
};

export const createOrderDiscount = async (payload: OrderDiscountPayload): Promise<OrderDiscount> => {
  const response = await axiosInstance.post<ApiResponse<OrderDiscount>>('/order-discount/create', payload);
  return response.data.data!;
};

export const updateOrderDiscount = async (id: string, payload: OrderDiscountPayload): Promise<OrderDiscount> => {
  const response = await axiosInstance.post<ApiResponse<OrderDiscount>>(`/order-discount/${id}/edit`, payload);
  return response.data.data!;
};

export const deleteOrderDiscount = async (id: string, payload: DiscountDeletePayload): Promise<void> => {
  await axiosInstance.post(`/order-discount/${id}/delete`, payload);
};