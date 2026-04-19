import express from "express";
import cors from "cors";
import clientRoutes from "./routes/client.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import blockedTimeRoutes from "./routes/blockedTime.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API rodando com sucesso" });
});

app.use("/clients", clientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/blocked-times", blockedTimeRoutes);

export default app;