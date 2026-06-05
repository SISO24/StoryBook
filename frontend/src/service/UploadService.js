import { uploadAudioApi, uploadImageApi } from "../api/upload.api";

export const uploadImageService = async (file) => {
  const response = await uploadImageApi(file);
  return response.data.url;
};

export const uploadAudioService = async (file) => {
  const response = await uploadAudioApi(file);
  return response.data.url;
};
