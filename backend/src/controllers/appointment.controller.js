import prisma from "../prisma/client.js";

export const getAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        client: true
      },
      orderBy: {
        date: "asc"
      }
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamentos" });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true
      }
    });

    if (!appointment) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamento" });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { date, status, clientId } = req.body;

    if (!date || !clientId) {
      return res.status(400).json({
        error: "date e clientId são obrigatórios"
      });
    }

    const clientExists = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!clientExists) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    
    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        status: status || "scheduled",
        clientId
      },
      include: {
        client: true
      }
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status, clientId } = req.body;

    const appointmentExists = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointmentExists) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    if (clientId) {
      const clientExists = await prisma.client.findUnique({
        where: { id: clientId }
      });

      if (!clientExists) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(status && { status }),
        ...(clientId && { clientId })
      },
      include: {
        client: true
      }
    });

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar agendamento" });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointmentExists = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointmentExists) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    await prisma.appointment.delete({
      where: { id }
    });

    res.json({ message: "Agendamento removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover agendamento" });
  }
};