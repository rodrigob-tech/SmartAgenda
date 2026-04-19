import { useState } from "react";
import { STATUS_OPTIONS } from "../../constants/appointmentStatus";

export default function AppointmentForm({ clients, onSubmit }) {
  const [formData, setFormData] = useState({
    clientId: "",
    date: "",
    status: "scheduled"
  });

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

    setFormData({
      clientId: "",
      date: "",
      status: "scheduled"
    });
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

      <button type="submit">Criar agendamento</button>
    </form>
  );
}