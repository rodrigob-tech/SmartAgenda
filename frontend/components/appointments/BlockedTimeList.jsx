export default function BlockedTimeList({ blockedTimes, onDelete }) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Horários bloqueados</h2>

      {blockedTimes.length === 0 ? (
        <p>Nenhum horário bloqueado.</p>
      ) : (
        <ul style={{ paddingLeft: "20px" }}>
          {blockedTimes.map((blockedTime) => (
            <li
              key={blockedTime.id}
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap"
              }}
            >
              <span>
                Início: {new Date(blockedTime.start).toLocaleString("pt-BR")} |
                Fim: {new Date(blockedTime.end).toLocaleString("pt-BR")}
              </span>

              <button onClick={() => onDelete(blockedTime.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}