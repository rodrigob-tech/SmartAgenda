import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveUserAuth } from "../src/services/userAuthStorage";


export default function UserLoginPage() {
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
      const response = await api.post("/user-auth/login", formData);

      saveUserAuth({
        token: response.data.token,
        user: response.data.user
      });

      alert("Login admin realizado com sucesso");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao fazer login admin");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Login do painel admin</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="email"
          name="email"
          placeholder="Email do admin"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Entrar no painel</button>
      </form>
    </div>
  );
}