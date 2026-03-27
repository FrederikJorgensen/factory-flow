import { useEffect, useState } from "react";
import { Button } from "./Button";

type EquipmentState = "red" | "yellow" | "green";

export interface Equipment {
    id: string;
    name: string;
    state: EquipmentState;
}

const equipmentStates: EquipmentState[] = ["red", "yellow", "green"];

export default function App() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);

    useEffect(() => {
        fetch("/api/factory-floor/equipment")
            .then(
                (response) =>
                    response.json() as Promise<{ equipment: Equipment[] }>
            )
            .then((data) => {
                setEquipment(data.equipment);
            })
            .catch(() => {
                setEquipment([]);
            });
    }, []);

    const redCount = equipment.filter((item) => item.state === "red").length;
    const yellowCount = equipment.filter(
        (item) => item.state === "yellow"
    ).length;
    const greenCount = equipment.filter(
        (item) => item.state === "green"
    ).length;

    return (
        <main className="min-h-screen bg-stone-50 px-3 py-5 text-black sm:px-4 md:px-6">
            <div className="mx-auto flex max-w-screen-2xl flex-col gap-5 sm:gap-6">
                <section className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1 text-sm font-medium text-black sm:px-2 sm:text-base">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-600" />
                        <span className="font-serif">{redCount} Red</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-amber-700" />
                        <span className="font-serif">{yellowCount} Yellow</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-green-700" />
                        <span className="font-serif">{greenCount} Green</span>
                    </div>
                </section>

                <section className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {equipment.map((equipment) => (
                        <div
                            key={equipment.id}
                            className={`rounded-2xl border-2 px-4 py-4 shadow-sm sm:px-5 sm:py-5 ${mapCardColor(equipment.state)}`}
                        >
                            <div className="flex flex-col gap-3">
                                <div>
                                    <h2 className="text-xl font-semibold leading-tight sm:text-2xl">
                                        {equipment.name}
                                    </h2>
                                    <p className="mt-1 text-xs text-stone-400">
                                        tap for details
                                    </p>
                                </div>

                                <div
                                    className={`flex items-center gap-2 text-sm font-medium sm:text-base ${mapStatusTextColor(equipment.state)}`}
                                >
                                    <span
                                        className={`h-3 w-3 shrink-0 rounded-full ${mapDotColor(equipment.state)}`}
                                    />
                                    <span className="font-serif leading-tight">
                                        {mapStateLabel(equipment.state)}
                                    </span>
                                </div>
                            </div>

                            <section className="mt-4 flex gap-2">
                                {equipmentStates.map((state) => (
                                    <Button
                                        className={`flex-1 text-xs sm:text-sm ${mapButtonColor(equipment.state, state)}`}
                                        key={state}
                                        onClick={() => {}}
                                    >
                                        {mapShortLabel(state)}
                                    </Button>
                                ))}
                            </section>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}

function mapCardColor(state: EquipmentState) {
    switch (state) {
        case "red":
            return "border-red-200 bg-red-50";
        case "yellow":
            return "border-amber-400 bg-amber-50";
        case "green":
            return "border-green-200 bg-green-50";
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

function mapStatusTextColor(state: EquipmentState) {
    switch (state) {
        case "red":
            return "text-red-600";
        case "yellow":
            return "text-amber-700";
        case "green":
            return "text-green-700";
    }
}

function mapButtonColor(
    selectedState: EquipmentState,
    buttonState: EquipmentState
) {
    if (selectedState === buttonState) {
        switch (buttonState) {
            case "red":
                return "bg-red-600 text-white";
            case "yellow":
                return "bg-amber-700 text-white";
            case "green":
                return "bg-green-700 text-white";
        }
    }

    return "bg-transparent text-black";
}

function mapStateLabel(state: EquipmentState) {
    switch (state) {
        case "red":
            return "Stopped";
        case "yellow":
            return "Starting / winding down";
        case "green":
            return "Producing";
    }
}

function mapShortLabel(state: EquipmentState) {
    switch (state) {
        case "red":
            return "Red";
        case "yellow":
            return "Yellow";
        case "green":
            return "Green";
    }
}
