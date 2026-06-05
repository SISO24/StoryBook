import api from "./axios";

export const getStoriesApi = () => api.get(`/stories`);

export const getStoryApi = (id) => api.get(`/stories/${id}`);

export const createStoryApi = (data) => api.post("/stories", data);

export const updateStoryApi = (id, data) => api.put(`/stories/${id}`, data);

export const deleteStoryApi = (id) => api.delete(`/stories/${id}`);

export const addBlockApi = (storyId, data) =>
  api.post(`/stories/${storyId}/blocks`, data);

export const updateBlockApi = (storyId, blockId, data) =>
  api.put(`/stories/${storyId}/blocks/${blockId}`, data);

export const deleteBlocksApi = (storyId, blockId) =>
  api.delete(`/stories/${storyId}/blocks/${blockId}`);

export const shareStoryApi = (storyId, data) =>
  api.post(`/stories/${storyId}/share`, data);

export const getSharedStoriesApi = () => api.get(`/stories/shared-with-me`);

export const getSharedStoryApi = (storyId) =>
  api.get(`/stories/shared/${storyId}`);

export const revokeShareApi = (storyId, shareId) =>
  api.delete(`/stories/${storyId}/share/${shareId}`);
