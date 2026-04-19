import api from "./api";

export const getAppointments = () => api.get("/appointments");

export const createAppointment = (data) => api.post("/appointments", data);

export const updateAppointment = (id, data) =>
  api.put(`/appointments/${id}`, data);

export const deleteAppointment = (id) =>
  api.delete(`/appointments/${id}`);