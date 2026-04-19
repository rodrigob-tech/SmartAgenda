import api from "./api";

export const getBlockedTimes = () => api.get("/blocked-times");

export const createBlockedTime = (data) => api.post("/blocked-times", data);

export const updateBlockedTime = (id, data) =>
  api.put(`/blocked-times/${id}`, data);

export const deleteBlockedTime = (id) =>
  api.delete(`/blocked-times/${id}`);