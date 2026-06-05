import api from "./axios";

export const uploadImageApi = (file) => {
  const formdata = new FormData();
  formdata.append("file", file);
  return api.post(`/upload/image`, formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadAudioApi = (file) => {
  const formdata = new FormData();
  formdata.append("file", file);
  return api.post(`/upload/audio`, formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
