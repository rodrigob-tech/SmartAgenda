export default function BlockedTimeList({ blockedTimes }) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Horários bloqueados</h2>

      {blockedTimes.length === 0 ? (
        <p>Nenhum horário bloqueado.</p>
      ) : (
        <ul>
          {blockedTimes.map((blockedTime) => (
            <li key={blockedTime.id}>
              Início: {new Date(blockedTime.start).toLocaleString("pt-BR")} |
              Fim: {new Date(blockedTime.end).toLocaleString("pt-BR")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}