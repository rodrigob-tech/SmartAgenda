import { useEffect, useState } from "react";
import AppointmentForm from "../components/appointments/AppointmentForm";
import AppointmentCalendar from "../components/appointments/AppointmentCalendar";
import BlockedTimeForm from "../components/appointments/BlockedTimeForm";
import BlockedTimeList from "../components/appointments/BlockedTimeList";
import {
  getAppointments,
  createAppointment
} from "../services/appointmentService";
import { getClients } from "../services/clientService";

import { mapAppointmentsToEvents } from "../utils/appointmentMapper";
import { getBlockedTimes,createBlockedTime } from "../services/blockedTime.service";
export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [blockedTimes, setBlockedTimes] = useState([]);

  const loadData = async () => {
    try {
      const [appointmentsResponse, clientsResponse, blockedTimesResponse] =
        await Promise.all([
          getAppointments(),
          getClients(),
          getBlockedTimes()
        ]);

      setEvents(mapAppointmentsToEvents(appointmentsResponse.data));
      setClients(clientsResponse.data);
      setBlockedTimes(blockedTimesResponse.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleCreateAppointment = async (formData) => {
    try {
      await createAppointment(formData);
      await loadData();
      alert("Agendamento criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);

      const message =
        error.response?.data?.error || "Erro ao criar agendamento";

      alert(message);
    }
  };

  const handleCreateBlockedTime = async (formData) => {
    try {
      await createBlockedTime(formData);
      await loadData();
      alert("Bloqueio criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar bloqueio:", error);

      const message =
        error.response?.data?.error || "Erro ao criar bloqueio";

      alert(message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Agenda de Atendimentos</h1>

      <AppointmentForm
        clients={clients}
        onSubmit={handleCreateAppointment}
      />

      <BlockedTimeForm onSubmit={handleCreateBlockedTime} />

      <BlockedTimeList blockedTimes={blockedTimes} />

      <AppointmentCalendar events={events} />
    </div>
  );
}