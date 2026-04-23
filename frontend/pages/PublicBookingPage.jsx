import { useEffect, useState } from "react";
import api from "../services/api";

import SpaceSelector from "../components/publicBooking/SpaceSelector";
import SlotSelector from "../components/publicBooking/SlotSelector";
import PublicBookingForm from "../components/publicBooking/PublicBookingForm";

import { getClientToken, getClientData, clearClientAuth } from "../src/services/clientAuthStorage";


export default function PublicBookingPage() {
    const [spaces, setSpaces] = useState([]);
    const [selectedSpace, setSelectedSpace] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const client = getClientData();

    useEffect(() => {
        loadSpaces();
    }, []);
    const loadSpaces = async () => {
    try {
        const response = await api.get("/public-booking/spaces");
        setSpaces(response.data);
    } catch (error) {
        console.error("Erro ao carregar espaços:", error);
        alert(error.response?.data?.error || "Erro ao carregar espaços");
    }
    };
    const loadSlots = async () => {
        try {
            if (!selectedDate || !selectedSpace) {
                alert("Selecione uma data e um espaço");
                return;
            }

            const response = await api.get("/public-booking/available-slots", {
                params: {
                    date: selectedDate,
                    spaceId: selectedSpace
                }
            });

            setSlots(response.data.slots);
            setSelectedSlot("");
        } catch (error) {
            console.error("Erro ao buscar horários:", error);
            alert(error.response?.data?.error || "Erro ao buscar horários");
        }
    };

    const handleBooking = async (formData) => {
        try {
            const token = getClientToken();

            await api.post("/public-booking/book", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Agendamento confirmado com sucesso");
            setSelectedSlot("");
            await loadSlots();
        } catch (error) {
            console.error("Erro ao confirmar agendamento:", error);
            alert(error.response?.data?.error || "Erro ao confirmar agendamento");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <div style={{ marginBottom: "20px" }}>
                <p>
                    Cliente autenticado: <strong>{client?.name}</strong> ({client?.email})
                </p>
                <button
                    type="button"
                    onClick={() => {
                        clearClientAuth();
                        window.location.href = "/login-cliente";
                    }}
                >
                    Sair
                </button>
            </div>
            <h1>Agende seu atendimento</h1>
            <p>Escolha um espaço, uma data e um horário disponível.</p>
            <SpaceSelector
                spaces={spaces}
                value={selectedSpace}
                onChange={setSelectedSpace}
            />

            <div style={{ marginBottom: "20px" }}>
                <label>Data</label>
                <br />
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            <button type="button" onClick={loadSlots}>
                Buscar horários
            </button>

            <div style={{ marginTop: "30px" }}>
                <SlotSelector
                    slots={slots}
                    selectedSlot={selectedSlot}
                    onSelect={setSelectedSlot}
                />
            </div>

           <PublicBookingForm
                selectedSlot={selectedSlot}
                spaceId={selectedSpace}
                spaces={spaces}
                onSubmit={handleBooking}
            />
        </div>
    );
}