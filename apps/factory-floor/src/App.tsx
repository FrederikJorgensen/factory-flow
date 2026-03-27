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
            <div className="mx-auto flex max-w-screen-2xl flex-col gap-5 sm:gap-8">
                <section className="flex flex-wrap items-center gap-x-5 gap-y-3 px-1 text-base font-medium text-black sm:px-2 sm:text-xl md:text-2xl">
                    <div className="flex items-center gap-3">
                        <span className="h-4 w-4 rounded-full bg-red-600 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                        <span className="font-serif">{redCount} Red</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="h-4 w-4 rounded-full bg-amber-700 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                        <span className="font-serif">{yellowCount} Yellow</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="h-4 w-4 rounded-full bg-green-700 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                        <span className="font-serif">{greenCount} Green</span>
                    </div>
                </section>

                <section className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {equipment.map((equipment) => (
                        <div
                            key={equipment.id}
                            className={`rounded-3xl border-[3px] px-5 py-5 shadow-sm sm:rounded-[1.8rem] sm:border-4 sm:px-7 sm:py-7 lg:px-9 lg:py-8 ${mapCardColor(equipment.state)}`}
                        >
                            <div className="flex flex-col gap-4 sm:gap-5">
                                <div>
                                    <h2 className="max-w-48 text-2xl font-semibold leading-tight sm:text-3xl">
                                        {equipment.name}
                                    </h2>
                                    <p className="mt-2 text-lg sm:text-2xl">
                                        tap for details
                                    </p>
                                </div>

                                <div
                                    className={`flex items-start gap-3 text-lg font-medium sm:items-center sm:text-2xl ${mapStatusTextColor(equipment.state)}`}
                                >
                                    <span
                                        className={`mt-1 h-5 w-5 shrink-0 rounded-full sm:mt-0 sm:h-7 sm:w-7 ${mapDotColor(equipment.state)}`}
                                    />
                                    <span className="font-serif leading-tight">
                                        {mapStateLabel(equipment.state)}
                                    </span>
                                </div>
                            </div>

                            <section className="mt-6 grid grid-cols-3 gap-2 sm:mt-10 sm:gap-3">
                                {equipmentStates.map((state) => (
                                    <Button
                                        className={mapButtonColor(
                                            equipment.state,
                                            state
                                        )}
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
