import { create } from "axios";
import {
  getStoriesApi,
  getStoryApi,
  createStoryApi,
  updateStoryApi,
  deleteStoryApi,
  addBlockApi,
  updateBlockApi,
  deleteBlocksApi,
  shareStoryApi,
  getSharedStoriesApi,
  getSharedStoryApi,
  revokeShareApi,
} from "../api/story.api";

export const getStoriesService = async () => {
  const response = await getStoriesApi();
  return response.data;
};

export const getStoryService = async (id) => {
  const response = await getStoryApi(id);
  return response.data;
};

export const createStoryService = async (title) => {
  const response = await createStoryApi({ title });
  return response.data;
};

export const updateStoryService = async (id, title) => {
  const response = await updateStoryApi(id, { title });
  return response.data;
};

export const deleteStoryService = async (id) => {
  await deleteStoryApi(id);
};

export const addBlockService = async (storyId, type, content) => {
  const response = await addBlockApi(storyId, { type, content });
  return response.data;
};

export const updateBlockService = async (storyId, blockId, content) => {
  const response = await updateBlockApi(storyId, blockId, { content });
  return response.data;
};

export const deleteBlockService = async (storyId, blockId) => {
  await deleteBlockApi(storyId, blockId);
};

export const shareStoryService = async (storyId, email) => {
  const response = await shareStoryApi(storyId, { email });
  return response.data;
};

export const getSharedStoriesService = async () => {
  const response = await getSharedStoriesApi();
  return response.data;
};

export const getSharedStoryService = async (storyId) => {
  const response = await getSharedStoryApi(storyId);
  return response.data;
};

export const revokeShareService = async (storyId, shareId) => {
  await revokeShareApi(storyId, shareId);
};
