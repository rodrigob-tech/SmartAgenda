import { useState } from "react";

export default function BlockedTimeForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    start: "",
    end: ""
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
      start: "",
      end: ""
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
      <h2>Bloquear horário</h2>

      <input
        type="datetime-local"
        name="start"
        value={formData.start}
        onChange={handleChange}
        required
      />

      <input
        type="datetime-local"
        name="end"
        value={formData.end}
        onChange={handleChange}
        required
      />

      <button type="submit">Criar bloqueio</button>
    </form>
  );
}