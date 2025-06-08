import axiosInstance from '@/lib/utils/axiosInstance';
import { ProductReview, ProductReviewPayload, ProductReviewDeletePayload } from '@/lib/types/review';
import { ApiResponse } from '@/lib/types/common';

export const fetchProductReviews = async (productId: string): Promise<ProductReview[]> => {
  const response = await axiosInstance.get<ApiResponse<ProductReview[]>>(`/product-review/${productId}`);
  return response.data.data || [];
};

export const createProductReview = async (payload: ProductReviewPayload): Promise<ProductReview> => {
  const response = await axiosInstance.post<ApiResponse<ProductReview>>('/product-review/create', payload);
  return response.data.data!;
};

export const updateProductReview = async (id: string, payload: ProductReviewPayload): Promise<ProductReview> => {
  const response = await axiosInstance.post<ApiResponse<ProductReview>>(`/product-review/${id}/edit`, payload);
  return response.data.data!;
};

export const deleteProductReview = async (id: string, payload: ProductReviewDeletePayload): Promise<void> => {
  await axiosInstance.delete<ApiResponse<void>>(`/product-review/${id}/delete`, { data: payload });
};