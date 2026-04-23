export default function SlotSelector({ slots, selectedSlot, onSelect }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Horários disponíveis</h3>

      {slots.length === 0 ? (
        <p>Nenhum horário disponível para a data selecionada.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {slots.map((slot) => {
            const label = new Date(slot.start).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            });

            const isSelected = selectedSlot === slot.start;

            return (
              <button
                key={slot.start}
                type="button"
                onClick={() => onSelect(slot.start)}
                style={{
                  padding: "10px 14px",
                  border: "1px solid #ccc",
                  background: isSelected ? "#1976d2" : "#fff",
                  color: isSelected ? "#fff" : "#000",
                  cursor: "pointer"
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}