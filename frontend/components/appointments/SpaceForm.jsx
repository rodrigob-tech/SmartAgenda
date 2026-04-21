import { useEffect, useState } from "react";

export default function SpaceForm({ onSubmit, editingSpace, onCancelEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    if (editingSpace) {
      setFormData({
        name: editingSpace.name || "",
        description: editingSpace.description || ""
      });
    } else {
      setFormData({
        name: "",
        description: ""
      });
    }
  }, [editingSpace]);

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

    if (!editingSpace) {
      setFormData({
        name: "",
        description: ""
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
      <h2>{editingSpace ? "Editar espaço" : "Criar espaço"}</h2>

      <input
        type="text"
        name="name"
        placeholder="Nome do espaço"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="description"
        placeholder="Descrição do espaço"
        value={formData.description}
        onChange={handleChange}
      />

      <button type="submit">
        {editingSpace ? "Salvar alterações" : "Criar espaço"}
      </button>

      {editingSpace && (
        <button type="button" onClick={onCancelEdit}>
          Cancelar edição
        </button>
      )}
    </form>
  );
}   