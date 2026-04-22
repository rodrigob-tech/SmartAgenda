import express from "express";
import cors from "cors";
import clientRoutes from "./routes/client.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import blockedTimeRoutes from "./routes/blockedTime.routes.js";
import spaceRoutes from "./routes/space.routes.js";
import googleCalendarRoutes from "./routes/googleCalendar.routes.js";
import userRoutes from "./routes/user.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API rodando com sucesso" });
});

app.use("/clients", clientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/blocked-times", blockedTimeRoutes);
app.use("/spaces", spaceRoutes);
app.use("/google-calendar", googleCalendarRoutes);
app.use("/users", userRoutes);
export default app;