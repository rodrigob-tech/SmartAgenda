import { useEffect, useState } from "react";
import { STATUS_OPTIONS } from "../../constants/appointmentStatus";

function formatDateTimeLocal(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function AppointmentForm({
  clients,
  onSubmit,
  editingAppointment,
  onCancelEdit
}) {
  const [formData, setFormData] = useState({
    clientId: "",
    date: "",
    status: "scheduled"
  });

  useEffect(() => {
    if (editingAppointment) {
      setFormData({
        clientId: editingAppointment.clientId || "",
        date: formatDateTimeLocal(editingAppointment.date),
        status: editingAppointment.status || "scheduled"
      });
    } else {
      setFormData({
        clientId: "",
        date: "",
        status: "scheduled"
      });
    }
  }, [editingAppointment]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit(formData);

    if (!editingAppointment) {
      setFormData({
        clientId: "",
        date: "",
        status: "scheduled"
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "400px"
      }}
    >
      <h2>{editingAppointment ? "Editar agendamento" : "Criar agendamento"}</h2>

      <select
        name="clientId"
        value={formData.clientId}
        onChange={handleChange}
        required
      >
        <option value="">Selecione um cliente</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <button type="submit">
        {editingAppointment ? "Salvar alterações" : "Criar agendamento"}
      </button>

      {editingAppointment && (
        <button type="button" onClick={onCancelEdit}>
          Cancelar edição
        </button>
      )}
    </form>
  );
}