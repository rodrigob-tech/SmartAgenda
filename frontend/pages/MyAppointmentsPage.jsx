import { useEffect, useState } from "react";
import api from "../services/api";
import { getClientToken, getClientData } from "../src/services/clientAuthStorage";

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const client = getClientData();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const token = getClientToken();

      const response = await api.get("/client-bookings/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAppointments(response.data);
    } catch (error) {
      console.error("Erro ao buscar meus agendamentos:", error);
      alert(error.response?.data?.error || "Erro ao buscar agendamentos");
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const confirmed = window.confirm("Deseja realmente cancelar este agendamento?");
    if (!confirmed) return;

    try {
      const token = getClientToken();

      await api.patch(`/client-bookings/${appointmentId}/cancel`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Agendamento cancelado com sucesso");
      await loadAppointments();
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      alert(error.response?.data?.error || "Erro ao cancelar agendamento");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Meus agendamentos</h1>

      <p>
        Cliente: <strong>{client?.name}</strong> ({client?.email})
      </p>

      {appointments.length === 0 ? (
        <p>Você ainda não possui agendamentos.</p>
      ) : (
        <ul style={{ paddingLeft: "0" }}>
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              style={{
                marginBottom: "12px",
                border: "1px solid #ccc",
                padding: "12px",
                borderRadius: "8px",
                listStyle: "none"
              }}
            >
              <p>
                <strong>Data:</strong>{" "}
                {new Date(appointment.date).toLocaleString("pt-BR")}
              </p>
              <p>
                <strong>Status:</strong> {appointment.status}
              </p>
              <p>
                <strong>Espaço:</strong>{" "}
                {appointment.space?.name || "Não informado"}
              </p>

              {appointment.status !== "canceled" && (
                <button
                  type="button"
                  onClick={() => handleCancelAppointment(appointment.id)}
                >
                  Cancelar agendamento
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}