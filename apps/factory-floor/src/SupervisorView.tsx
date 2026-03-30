import { useEffect, useState } from "react";
import { Equipment, EquipmentState } from "./App";
import { useNavigate } from "react-router-dom";

interface StateChangeEvent {
    id: string;
    equipmentId: string;
    equipmentName: string;
    fromState: EquipmentState;
    toState: EquipmentState;
    timestamp: string;
}

export default function SupervisorView() {
    const navigate = useNavigate();
    const [events, setEvents] = useState<StateChangeEvent[]>([]);
    const [isAuthed, setIsAuthed] = useState<boolean>(false);

    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        if (!isAuthed) return;
        fetch("/api/factory-floor/equipment")
            .then((r) => r.json() as Promise<{ equipment: Equipment[] }>)
            .then((data) => {
                console.log("data.equipment: ", data.equipment);
                setEquipment(data.equipment);
                setSelectedEquipmentId(data.equipment[0]?.id ?? "");
            })
            .catch(() => setEquipment([]));
    }, [isAuthed]);

    async function handleScheduleOrder() {
        if (!selectedEquipmentId || !orderId.trim()) return;
        await fetch("/api/factory-floor/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                equipmentId: selectedEquipmentId,
                orderId
            })
        });
        setOrderId("");
    }

    useEffect(() => {
        const saved = sessionStorage.getItem("supervisor-auth");

        if (saved === "true") {
            setIsAuthed(true);
            return;
        }

        const input = window.prompt("Enter password");

        if (input === "lego") {
            sessionStorage.setItem("supervisor-auth", "true");
            setIsAuthed(true);
        }
    }, []);

    useEffect(() => {
        if (!isAuthed) return;

        fetch("/api/factory-floor/history")
            .then(
                (response) =>
                    response.json() as Promise<{ events: StateChangeEvent[] }>
            )
            .then((data) => setEvents(data.events))
            .catch(() => setEvents([]));
    }, [isAuthed]);

    useEffect(() => {
        if (!isAuthed) return;

        const ws = new WebSocket("ws://localhost:3000");

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data) as {
                type: string;
                payload: unknown;
            };

            if (message.type === "equipment:update") {
                fetch("/api/factory-floor/history")
                    .then(
                        (response) =>
                            response.json() as Promise<{
                                events: StateChangeEvent[];
                            }>
                    )
                    .then((data) => setEvents(data.events))
                    .catch(() => setEvents([]));
            }
        };

        return () => {
            ws.close();
        };
    }, [isAuthed]);

    if (!isAuthed) {
        return null;
    }

    return (
        <main className="min-h-screen bg-stone-50 px-3 py-5 text-black sm:px-4 md:px-6">
            <div className="mx-auto flex max-w-5xl flex-col gap-5">
                <div className="px-1 sm:px-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-md border px-3 py-1.5 text-xs sm:text-sm"
                    >
                        Back
                    </button>
                    <h1 className="font-serif text-2xl font-semibold sm:text-3xl">
                        State History
                    </h1>
                    <p className="mt-1 text-xs text-stone-400">
                        All equipment state changes
                    </p>
                </div>

                <div className="overflow-hidden rounded-2xl border-2 border-stone-200 bg-white shadow-sm p-5">
                    <h2 className="font-serif text-lg font-semibold mb-3">
                        Schedule Order
                    </h2>
                    <div className="flex gap-2 flex-wrap">
                        <select
                            value={selectedEquipmentId}
                            onChange={(e) =>
                                setSelectedEquipmentId(e.target.value)
                            }
                            className="rounded-md border px-3 py-1.5 text-sm"
                        >
                            {equipment.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Order id"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="rounded-md border px-3 py-1.5 text-sm flex-1"
                        />
                        <button
                            onClick={() => void handleScheduleOrder()}
                            className="rounded-md border px-3 py-1.5 text-sm font-medium"
                        >
                            Schedule
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border-2 border-stone-200 bg-white shadow-sm">
                    {events.length === 0 ? (
                        <p className="px-5 py-8 text-center text-sm text-stone-400">
                            No state changes recorded yet.
                        </p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-stone-100 text-left text-xs font-medium text-stone-400">
                                    <th className="px-4 py-3">Time</th>
                                    <th className="px-4 py-3">Equipment</th>
                                    <th className="px-4 py-3">From</th>
                                    <th className="px-4 py-3">To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events
                                    .slice()
                                    .reverse()
                                    .map((event) => (
                                        <tr
                                            key={event.id}
                                            className="border-b border-stone-100 last:border-0"
                                        >
                                            <td className="px-4 py-3 text-stone-400">
                                                {formatTime(event.timestamp)}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {event.equipmentName}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StateBadge
                                                    state={event.fromState}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <StateBadge
                                                    state={event.toState}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </main>
    );
}

function StateBadge({ state }: { state: EquipmentState }) {
    return (
        <span
            className={`flex items-center gap-1.5 font-serif text-sm ${mapTextColor(state)}`}
        >
            <span
                className={`h-2.5 w-2.5 rounded-full ${mapDotColor(state)}`}
            />
            {mapLabel(state)}
        </span>
    );
}

function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    return (
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        " · " +
        date.toLocaleDateString([], { month: "short", day: "numeric" })
    );
}

function mapLabel(state: EquipmentState) {
    switch (state) {
        case "red":
            return "Stopped";
        case "yellow":
            return "Starting / winding down";
        case "green":
            return "Producing";
    }
}

function mapDotColor(state: EquipmentState) {
    switch (state) {
        case "red":
            return "bg-red-600";
        case "yellow":
            return "bg-amber-700";
        case "green":
            return "bg-green-700";
    }
}

function mapTextColor(state: EquipmentState) {
    switch (state) {
        case "red":
            return "text-red-600";
        case "yellow":
            return "text-amber-700";
        case "green":
            return "text-green-700";
    }
}
