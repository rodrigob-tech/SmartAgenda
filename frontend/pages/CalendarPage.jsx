import { useEffect, useState } from "react";
import AppointmentForm from "../components/appointments/AppointmentForm";
import AppointmentCalendar from "../components/appointments/AppointmentCalendar";
import AppointmentList from "../components/appointments/AppointmentList";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment } from "../services/appointmentService";
import { getClients } from "../services/clientService";
import { mapAppointmentsToEvents,
         mapBlockedTimesToEvents } from "../utils/appointmentMapper";
import BlockedTimeForm from "../components/appointments/BlockedTimeForm";
import BlockedTimeList from "../components/appointments/BlockedTimeList";
import { getBlockedTimes,
         createBlockedTime,
         deleteBlockedTime } from "../services/blockedTime.service";
import SpaceForm from "../components/appointments/SpaceForm";
import SpaceList from "../components/appointments/SpaceList";
import {
  getSpaces,
  createSpace,
  updateSpace,
  deleteSpace
} from "../services/spaceService";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [blockedTimes, setBlockedTimes] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [editingSpace, setEditingSpace] = useState(null);

const loadData = async () => {
  try {
    const [
      appointmentsResponse,
      clientsResponse,
      blockedTimesResponse,
      spacesResponse
    ] = await Promise.all([
      getAppointments(),
      getClients(),
      getBlockedTimes(),
      getSpaces()
    ]);

    const appointmentEvents = mapAppointmentsToEvents(appointmentsResponse.data);
    const blockedEvents = mapBlockedTimesToEvents(blockedTimesResponse.data);

    setAppointments(appointmentsResponse.data);
    setEvents([...appointmentEvents, ...blockedEvents]);
    setClients(clientsResponse.data);
    setBlockedTimes(blockedTimesResponse.data);
    setSpaces(spacesResponse.data);
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

  const handleSubmitSpace = async (formData) => {
  try {
    if (editingSpace) {
      await updateSpace(editingSpace.id, formData);
      alert("Espaço atualizado com sucesso");
      setEditingSpace(null);
    } else {
      await createSpace(formData);
      alert("Espaço criado com sucesso");
    }

    await loadData();
  } catch (error) {
    console.error("Erro ao salvar espaço:", error);

    const message =
      error.response?.data?.error || "Erro ao salvar espaço";

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
  const handleDeleteSpace = async (id) => {
  try {
    await deleteSpace(id);
    await loadData();
    alert("Espaço removido com sucesso");
  } catch (error) {
    console.error("Erro ao remover espaço:", error);

    const message =
      error.response?.data?.error || "Erro ao remover espaço";

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
        spaces={spaces}
        onSubmit={handleSubmitAppointment}
        editingAppointment={editingAppointment}
        onCancelEdit={() => setEditingAppointment(null)}
      />
      <AppointmentList
        appointments={appointments}
        onDelete={handleDeleteAppointment}
        onEdit={setEditingAppointment}
      />
      <SpaceForm
        onSubmit={handleSubmitSpace}
        editingSpace={editingSpace}
        onCancelEdit={() => setEditingSpace(null)}
      />

      <SpaceList
        spaces={spaces}
        onEdit={setEditingSpace}
        onDelete={handleDeleteSpace}
      />
      <BlockedTimeForm onSubmit={handleCreateBlockedTime} />

      <BlockedTimeList blockedTimes={blockedTimes}
                       onDelete={handleDeleteBlockedTime} 
      />

      <AppointmentCalendar events={events} />
    </div>
  );
}