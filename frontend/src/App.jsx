import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import CalendarPage from "../pages/CalendarPage";
import MyAppointmentsPage from "../pages/MyAppointmentsPage";
import AdminProtectedRoute from "../components/admin/AdminProtectedRoute";
import PublicBookingPage from "../pages/PublicBookingPage";
import ClientRegisterPage from "../pages/ClientRegisterPage";
import ClientLoginPage from "../pages/ClientLoginPage";
import ClientProtectedRoute from "../components/publicBooking/ClientProtectedRoute";
import UserLoginPage from "../pages/UserLoginPage";


function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fb"
        }}
      >
        <header
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            position: "sticky",
            top: 0,
            zIndex: 100
          }}
        >
          <div
            style={{
              maxWidth: "1700px",
              margin: "0 auto",
              padding: "14px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap"
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#1976d2",
                  lineHeight: 1
                }}
              >
                SmartAgenda
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  marginTop: "4px"
                }}
              >
                Gestão de atendimentos e autoagendamento
              </div>
            </div>

            <nav
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                alignItems: "center"
              }}
            >
              <div style={navGroupStyle}>
                <span style={groupLabelStyle}>Admin</span>
                <NavItem to="/login-admin">Login admin</NavItem>
                <NavItem to="/">Painel</NavItem>
              </div>

              <div style={navGroupStyle}>
                <span style={groupLabelStyle}>Cliente</span>
                <NavItem to="/cadastro-cliente">Cadastro</NavItem>
                <NavItem to="/login-cliente">Login</NavItem>
                <NavItem to="/agendar">Agendar</NavItem>
                <NavItem to="/meus-agendamentos">Meus agendamentos</NavItem>
              </div>
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/login-admin" element={<UserLoginPage />} />

            <Route
              path="/"
              element={
                <AdminProtectedRoute>
                  <CalendarPage />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/agendar"
              element={
                <ClientProtectedRoute>
                  <PublicBookingPage />
                </ClientProtectedRoute>
              }
            />

            <Route
              path="/meus-agendamentos"
              element={
                <ClientProtectedRoute>
                  <MyAppointmentsPage />
                </ClientProtectedRoute>
              }
            />

            <Route path="/cadastro-cliente" element={<ClientRegisterPage />} />
            <Route path="/login-cliente" element={<ClientLoginPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        textDecoration: "none",
        padding: "10px 14px",
        borderRadius: "10px",
        fontWeight: "600",
        fontSize: "14px",
        transition: "0.2s ease",
        background: isActive ? "#1976d2" : "#f8fafc",
        color: isActive ? "#ffffff" : "#334155",
        border: isActive ? "1px solid #1976d2" : "1px solid #e2e8f0"
      })}
    >
      {children}
    </NavLink>
  );
}

const navGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
  background: "#f8fafc",
  padding: "8px 10px",
  borderRadius: "14px",
  border: "1px solid #e2e8f0"
};

const groupLabelStyle = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginRight: "4px"
};

export default App;