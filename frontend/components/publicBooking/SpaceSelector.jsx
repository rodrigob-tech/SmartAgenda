export default function SpaceSelector({ spaces, value, onChange }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label>Espaço</label>
      <br />
      <select value={value} onChange={(e) => onChange(e.target.value)} required>
        <option value="">Selecione um espaço</option>
        {spaces.map((space) => (
          <option key={space.id} value={space.id}>
            {space.name}
          </option>
        ))}
      </select>
    </div>
  );
}