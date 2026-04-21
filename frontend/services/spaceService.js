import api from "./api";

export const getSpaces = () => api.get("/spaces");

export const createSpace = (data) => api.post("/spaces", data);

export const updateSpace = (id, data) => api.put(`/spaces/${id}`, data);

export const deleteSpace = (id) => api.delete(`/spaces/${id}`);