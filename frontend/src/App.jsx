import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CalendarPage from "../pages/CalendarPage";
import PublicBookingPage from "../pages/PublicBookingPage";
import ClientRegisterPage from "../pages/ClientRegisterPage";
import ClientLoginPage from "../pages/ClientLoginPage";
import ClientProtectedRoute from "../components/publicBooking/ClientProtectedRoute";
import MyAppointmentsPage from "../pages/MyAppointmentsPage"; 
import UserLoginPage from "../pages/UserLoginPage";

import AdminProtectedRoute from "../components/admin/AdminProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px" }}>
        <nav style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
          <Link to="/login-admin">Login admin</Link>
          <Link to="/">Painel interno</Link>
          <Link to="/agendar">Agendamento do cliente</Link>
          <Link to="/cadastro-cliente">Cadastro</Link>
          <Link to="/login-cliente">Login</Link>
          <Link to="/meus-agendamentos">Meus agendamentos</Link>
        </nav>

        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route
            path="/agendar"
            element={
              <ClientProtectedRoute>
                <PublicBookingPage />
              </ClientProtectedRoute>
            }
          />

          <Route path="/cadastro-cliente" element={<ClientRegisterPage />} />
          <Route path="/login-cliente" element={<ClientLoginPage />} />
          <Route
          path="/meus-agendamentos"
          element={
            <ClientProtectedRoute>
              <MyAppointmentsPage />
            </ClientProtectedRoute>
          }
          />
          <Route path="/login-admin" element={<UserLoginPage />} />

          <Route
            path="/"
            element={
              <AdminProtectedRoute>
                <CalendarPage />
              </AdminProtectedRoute>
            }
          />
        </Routes>
        
      </div>
    </BrowserRouter>
  );
}

export default App;