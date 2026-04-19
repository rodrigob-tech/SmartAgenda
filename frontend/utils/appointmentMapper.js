import { STATUS_COLORS } from "../constants/appointmentStatus";

export function mapAppointmentsToEvents(appointments) {
  return appointments.map((appointment) => ({
    id: appointment.id,
    title: `${appointment.client?.name || "Sem nome"} - ${appointment.status}`,
    start: appointment.date,
    color: STATUS_COLORS[appointment.status] || "#2196f3"
  }));
}