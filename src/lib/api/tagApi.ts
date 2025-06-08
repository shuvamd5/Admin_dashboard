import axiosInstance from '@/lib/utils/axiosInstance';
import { Tag, TagPayload, TagDeletePayload } from '@/lib/types/tag';
import { ApiResponse } from '@/lib/types/common';

export const fetchTags = async (): Promise<Tag[]> => {
  const response = await axiosInstance.get<ApiResponse<Tag>>('/tag/list');
  return response.data.datas || [];
};

export const createTag = async (payload: TagPayload): Promise<Tag> => {
  const response = await axiosInstance.post<ApiResponse<Tag>>('/tag/create', payload);
  return response.data.data!;
};

export const updateTag = async (id: string, payload: TagPayload): Promise<Tag> => {
  const response = await axiosInstance.post<ApiResponse<Tag>>(`/tag/${id}/edit`, payload);
  return response.data.data!;
};

export const deleteTag = async (id: string, payload: TagDeletePayload): Promise<void> => {
  await axiosInstance.post(`/tag/${id}/delete`, payload);
};