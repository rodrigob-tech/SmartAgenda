import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../services/api";

const statusColors = {
  scheduled: "#2196f3",
  confirmed: "#4caf50",
  pending: "#ff9800",
  canceled: "#f44336",
  done: "#9e9e9e"
};

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments");

      const formattedEvents = response.data.map((appointment) => ({
        id: appointment.id,
        title: appointment.client?.name || "Sem nome",
        start: appointment.date,
        color: statusColors[appointment.status] || "#2196f3",
        extendedProps: {
          status: appointment.status,
          email: appointment.client?.email,
          phone: appointment.client?.phone
        }
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Agenda de Atendimentos</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="pt-br"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        events={events}
        height="auto"
      />
    </div>
  );
}