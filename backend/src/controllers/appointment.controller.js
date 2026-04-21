import prisma from "../prisma/client.js";
import { sendEmail } from "../services/email.service.js";
export const getAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        client: true,
        space:  true
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
        client: true,
        space:  true
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
    const { date, status, clientId, spaceId } = req.body;
    if (!date || !clientId || !spaceId) {
      return res.status(400).json({
        error: "date, clientId e spaceId são obrigatórios"
      });
    }
    const validStatuses = ["scheduled", "confirmed", "pending", "canceled", "done"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }
    

    const appointmentDate = new Date(date);

    if (isNaN(appointmentDate.getTime())) {
     return res.status(400).json({ error: "Data inválida" });
}
    const clientExists = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!clientExists) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    if (spaceId) {
      const spaceExists = await prisma.space.findUnique({
        where: { id: spaceId }
      });

      if (!spaceExists) {
        return res.status(404).json({ error: "Espaço não encontrado" });
      }
    }

    const blockedTime = await prisma.blockedTime.findFirst({
      where: {
        start: {
          lte: appointmentDate
        },
        end: {
          gte: appointmentDate
        }
      }
    });

    if (blockedTime) {
      return res.status(400).json({
        error: "Este horário está bloqueado"
      });
    }
     if (spaceId) {
        const conflictingAppointment = await prisma.appointment.findFirst({
          where: {
            date: appointmentDate,
            spaceId: spaceId
          }
        });

        if (conflictingAppointment) {
          return res.status(400).json({
            error: "Já existe um agendamento neste horário para este espaço"
          });
        }
      }
    

    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentDate,
        status: status || "scheduled",
        clientId,
        // tava spaceId: spaceId
        spaceId
      },
      include: {
        client: true,
        space: true
      }
    });
    try{

      if (appointment.client?.email) {
        await sendEmail({
          to: appointment.client.email,
          subject: "Agendamento confirmado",
          text: `Olá, ${appointment.client.name}. Seu agendamento foi criado para ${new Date(
            appointment.date
          ).toLocaleString("pt-BR")}. Espaço: ${
            appointment.space?.name || "Não informado"
          }. Status: ${appointment.status}.`
        });
      }
    } catch (emailError) {
  console.error("Erro ao enviar email de criação:", emailError);
}
     
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
};
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status, clientId, spaceId } = req.body;

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

    if (spaceId) {
      const spaceExists = await prisma.space.findUnique({
        where: { id: spaceId }
      });

      if (!spaceExists) {
        return res.status(404).json({ error: "Espaço não encontrado" });
      }
    }

    const finalDate = date ? new Date(date) : appointmentExists.date;
    const finalSpaceId =
      spaceId !== undefined ? (spaceId || null) : appointmentExists.spaceId;
    if (!finalSpaceId) {
      return res.status(400).json({
        error: "spaceId é obrigatório"
      });
    }
    
    if (finalSpaceId) {
      const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
          id: {
            not: id
          },
          date: finalDate,
          spaceId: finalSpaceId
        }
      });

      if (conflictingAppointment) {
        return res.status(400).json({
          error: "Já existe um agendamento neste horário para este espaço"
        });
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(status && { status }),
        ...(clientId && { clientId }),
        ...(spaceId !== undefined && { spaceId: spaceId || null })
      },
      include: {
        client: true,
        space: true
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