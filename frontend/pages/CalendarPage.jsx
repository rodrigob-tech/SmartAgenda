import { useEffect, useState } from "react";
import AppointmentForm from "../components/appointments/AppointmentForm";
import AppointmentCalendar from "../components/appointments/AppointmentCalendar";
import AppointmentList from "../components/appointments/AppointmentList";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from "../services/appointmentService";
import { getClients } from "../services/clientService";
import {
  mapAppointmentsToEvents,
  mapBlockedTimesToEvents
} from "../utils/appointmentMapper";
import BlockedTimeForm from "../components/appointments/BlockedTimeForm";
import BlockedTimeList from "../components/appointments/BlockedTimeList";
import {
  getBlockedTimes,
  createBlockedTime,
  deleteBlockedTime
} from "../services/blockedTime.service";
import SpaceForm from "../components/appointments/SpaceForm";
import SpaceList from "../components/appointments/SpaceList";
import {
  getSpaces,
  createSpace,
  updateSpace,
  deleteSpace
} from "../services/spaceService";
import { getUserToken, getUserData, clearUserAuth } from "../src/services/userAuthStorage";









export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [blockedTimes, setBlockedTimes] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [editingSpace, setEditingSpace] = useState(null);
  const admin = getUserData();
  // ===== load data =====
  const loadData = async () => {
    try {
      const token = getUserToken();

      const authHeaders = {
        Authorization: `Bearer ${token}`
      };
      const [
        appointmentsResponse,
        clientsResponse,
        blockedTimesResponse,
        spacesResponse
      ] = await Promise.all([
        getAppointments(authHeaders),
        getClients(authHeaders),
        getBlockedTimes(authHeaders),
        getSpaces(authHeaders)
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
  // ===== appointment handlers =====
  const handleSubmitAppointment = async (formData) => {
    try {
      const token = getUserToken();
      const authHeaders = {
        Authorization: `Bearer ${token}`
      };
      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, formData, authHeaders);
        alert("Agendamento atualizado com sucesso");
        setEditingAppointment(null);
      } else {
        await createAppointment(formData, authHeaders);
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
      const confirmed = window.confirm("Deseja realmente excluir este agendamento?");
      if (!confirmed) return;
      const token = getUserToken();

      const authHeaders = {
        Authorization: `Bearer ${token}`
      };
      await deleteAppointment(id, authHeaders);
      await loadData();
      alert("Agendamento removido com sucesso");
    } catch (error) {
      console.error("Erro ao remover agendamento:", error);

      const message =
        error.response?.data?.error || "Erro ao remover agendamento";

      alert(message);
    }
  };
  // ===== blocked time handlers =====
  const handleCreateBlockedTime = async (formData) => {
    try {
      const token = getUserToken();

      const authHeaders = {
        Authorization: `Bearer ${token}`
      };
      await createBlockedTime(formData, authHeaders);
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
      const confirmed = window.confirm("Deseja realmente excluir este agendamento?");
      if (!confirmed) return;
      const token = getUserToken();

      const authHeaders = {
        Authorization: `Bearer ${token}`
      };
      await deleteBlockedTime(id, authHeaders);
      await loadData();
      alert("Bloqueio removido com sucesso");
    } catch (error) {
      console.error("Erro ao remover bloqueio:", error);

      const message =
        error.response?.data?.error || "Erro ao remover bloqueio";

      alert(message);
    }
  };

  // ===== space handlers =====
  const handleSubmitSpace = async (formData) => {
    try {
      const token = getUserToken();

      const authHeaders = {
        Authorization: `Bearer ${token}`
      };
      if (editingSpace) {
        await updateSpace(editingSpace.id, formData, authHeaders);
        alert("Espaço atualizado com sucesso");
        setEditingSpace(null);
      } else {
        await createSpace(formData, authHeaders);
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
  const handleDeleteSpace = async (id) => {
    try {
      const token = getUserToken();

      const authHeaders = {
        Authorization: `Bearer ${token}`
      };
      const confirmed = window.confirm("Deseja realmente excluir este agendamento?");
      if (!confirmed) return;
      await deleteSpace(id, authHeaders);
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
      <div style={{ marginBottom: "20px" }}>
        <p>
          Admin autenticado: <strong>{admin?.name}</strong> ({admin?.email})
        </p>

        <button
          type="button"
          onClick={() => {
            clearUserAuth();
            window.location.href = "/login-admin";
          }}
        >
          Sair do painel
        </button>
      </div>

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