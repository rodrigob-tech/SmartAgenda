import { useEffect, useState } from "react";
import AppointmentForm from "../components/appointments/AppointmentForm";
import AppointmentCalendar from "../components/appointments/AppointmentCalendar";
import AppointmentList from "../components/appointments/AppointmentList";
import BlockedTimeForm from "../components/appointments/BlockedTimeForm";
import BlockedTimeList from "../components/appointments/BlockedTimeList";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment } from "../services/appointmentService";
import { getClients } from "../services/clientService";
import { mapAppointmentsToEvents,
         mapBlockedTimesToEvents } from "../utils/appointmentMapper";
import { getBlockedTimes,
         createBlockedTime,
         deleteBlockedTime } from "../services/blockedTime.service";
export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [blockedTimes, setBlockedTimes] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const loadData = async () => {
    try {
      const [appointmentsResponse, clientsResponse, blockedTimesResponse] =
        await Promise.all([
          getAppointments(),
          getClients(),
          getBlockedTimes()
        ]);
        const appointmentEvents = mapAppointmentsToEvents(appointmentsResponse.data);
        const blockedEvents = mapBlockedTimesToEvents(blockedTimesResponse.data);

        setAppointments(appointmentsResponse.data);
        setEvents([...appointmentEvents, ...blockedEvents]);
        setClients(clientsResponse.data);
        setBlockedTimes(blockedTimesResponse.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleSubmitAppointment = async (formData) => {
  try {
    if (editingAppointment) {
      await updateAppointment(editingAppointment.id, formData);
      alert("Agendamento atualizado com sucesso");
      setEditingAppointment(null);
    } else {
      await createAppointment(formData);
      alert("Agendamento criado com sucesso");
    }

    await loadData();
  } catch (error) {
    console.error("Erro ao salvar agendamento:", error);

    const message =
      error.response?.data?.error || "Erro ao salvar agendamento";

    alert(message);
  }
  };
  const handleDeleteAppointment = async (id) => {
  try {
    await deleteAppointment(id);
    await loadData();
    alert("Agendamento removido com sucesso");
  } catch (error) {
    console.error("Erro ao remover agendamento:", error);

    const message =
      error.response?.data?.error || "Erro ao remover agendamento";

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
  const handleDeleteBlockedTime = async (id) => {
  try {
    await deleteBlockedTime(id);
    await loadData();
    alert("Bloqueio removido com sucesso");
  } catch (error) {
    console.error("Erro ao remover bloqueio:", error);

    const message =
      error.response?.data?.error || "Erro ao remover bloqueio";

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
      onSubmit={handleSubmitAppointment}
      editingAppointment={editingAppointment}
      onCancelEdit={() => setEditingAppointment(null)}
      />
      <AppointmentList
      appointments={appointments}
      onDelete={handleDeleteAppointment}
      onEdit={setEditingAppointment}
      />
      <BlockedTimeForm onSubmit={handleCreateBlockedTime} />

      <BlockedTimeList blockedTimes={blockedTimes}
                       onDelete={handleDeleteBlockedTime} 
      />

      <AppointmentCalendar events={events} />
    </div>
  );
}