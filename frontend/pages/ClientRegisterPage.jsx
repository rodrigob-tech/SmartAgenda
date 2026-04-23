import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";


import { saveClientAuth } from "../src/services/clientAuthStorage";

export default function ClientRegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
      const response = await api.post("/client-auth/register", formData);

      saveClientAuth({
        token: response.data.token,
        client: response.data.client
      });

      alert("Conta criada com sucesso");
      navigate("/agendar");
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao criar conta");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Criar conta</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input name="name" placeholder="Nome" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="phone" placeholder="Telefone" value={formData.phone} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Senha" value={formData.password} onChange={handleChange} required />
        <button type="submit">Cadastrar</button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Já tem conta? <Link to="/login-cliente">Entrar</Link>
      </p>
    </div>
  );
}