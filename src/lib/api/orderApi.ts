import axiosInstance from '@/lib/utils/axiosInstance';
import { Order, OrderItem, OrderPayload } from '@/lib/types/order';
import { ApiResponse } from '@/lib/types/common';

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await axiosInstance.get<ApiResponse<Order>>('/order/list');
  return response.data.datas || [];
};

export const fetchOrderItems = async (id: string): Promise<OrderItem[]> => {
  const response = await axiosInstance.get<ApiResponse<OrderItem[]>>(`/order/${id}/order-item/detail`);
  return response.data.data || [];
};

export const createOrder = async (payload: OrderPayload): Promise<Order> => {
  const response = await axiosInstance.post<ApiResponse<Order>>('/order', payload);
  return response.data.data!;
};