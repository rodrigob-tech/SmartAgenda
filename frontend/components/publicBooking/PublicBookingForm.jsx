

import { getClientData } from "../../src/services/clientAuthStorage";

export default function PublicBookingForm({
  selectedSlot,
  spaceId,
  spaces,
  onSubmit
}) {
  const client = getClientData();

  const selectedSpace = spaces.find((space) => space.id === spaceId);

  const formattedDate = selectedSlot
    ? new Date(selectedSlot).toLocaleDateString("pt-BR")
    : "";

  const formattedTime = selectedSlot
    ? new Date(selectedSlot).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })
    : "";

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedSlot || !spaceId) {
      alert("Selecione um espaço e um horário");
      return;
    }

    await onSubmit({
      date: selectedSlot,
      spaceId
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "500px"
      }}
    >
      <h3>Confirmação do agendamento</h3>

      <div>
        <strong>Espaço:</strong> {selectedSpace?.name || "Não selecionado"}
      </div>

      <div>
        <strong>Descrição do espaço:</strong>{" "}
        {selectedSpace?.description || "Sem descrição"}
      </div>

      <div>
        <strong>Data:</strong> {formattedDate || "Não selecionada"}
      </div>

      <div>
        <strong>Horário:</strong> {formattedTime || "Não selecionado"}
      </div>

      <button type="submit">Confirmar agendamento</button>
    </form>
  );
}