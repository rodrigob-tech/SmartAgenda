export default function SpaceList({ spaces, onEdit, onDelete }) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Espaços</h2>

      {spaces.length === 0 ? (
        <p>Nenhum espaço cadastrado.</p>
      ) : (
        <ul style={{ paddingLeft: "20px" }}>
          {spaces.map((space) => (
            <li
              key={space.id}
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap"
              }}
            >
              <span>
                Nome: {space.name} | Descrição: {space.description || "Sem descrição"}
              </span>

              <button onClick={() => onEdit(space)}>Editar</button>
              <button onClick={() => onDelete(space.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}