import { STATUS_COLORS } from "../constants/appointmentStatus";

export function mapAppointmentsToEvents(appointments) {
  return appointments.map((appointment) => ({
    id: appointment.id,
    title: `${appointment.client?.name || "Sem nome"} - ${appointment.status}`,
    start: appointment.date,
    color: STATUS_COLORS[appointment.status] || "#2196f3"
  }));
}
export function mapBlockedTimesToEvents(blockedTimes) {
  return blockedTimes.map((blockedTime) => ({
    id: `blocked-${blockedTime.id}`,
    title: "Horário Bloqueado",
    start: blockedTime.start,
    end: blockedTime.end,
    color: "#000000"
  }));
}