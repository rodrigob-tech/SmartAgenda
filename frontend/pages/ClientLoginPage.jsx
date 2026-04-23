import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";


import { saveClientAuth } from "../src/services/clientAuthStorage";

export default function ClientLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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

    try {
      const response = await api.post("/client-auth/login", formData);

      saveClientAuth({
        token: response.data.token,
        client: response.data.client
      });

      alert("Login realizado com sucesso");
      navigate("/agendar");
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao fazer login");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Entrar</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Senha" value={formData.password} onChange={handleChange} required />
        <button type="submit">Entrar</button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Ainda não tem conta? <Link to="/cadastro-cliente">Criar conta</Link>
      </p>
    </div>
  );
}