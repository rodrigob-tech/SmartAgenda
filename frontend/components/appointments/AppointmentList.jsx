export default function AppointmentList({ appointments, onDelete, onEdit }) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Agendamentos</h2>

      {appointments.length === 0 ? (
        <p>Nenhum agendamento cadastrado.</p>
      ) : (
        <ul style={{ paddingLeft: "20px" }}>
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap"
              }}
            >
             <span>
              Cliente: {appointment.client?.name || "Sem nome"} | Espaço:{" "}
              {appointment.space?.name || "Sem espaço"} | Data:{" "}
              {new Date(appointment.date).toLocaleString("pt-BR")} | Status:{" "}
              {appointment.status}
             </span>

              <button onClick={() => onEdit(appointment)}>Editar</button>
              <button onClick={() => onDelete(appointment.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}