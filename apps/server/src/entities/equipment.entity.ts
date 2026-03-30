export type EquipmentState = "red" | "yellow" | "green";

export type EquipmentEntity = {
    id: string;
    name: string;
    state: EquipmentState;
    scheduledOrders: { id: string; name: string }[];
};

export interface EquipmentRepository {
    getAll: () => Promise<EquipmentEntity[]>;
    updateState: (
        equipmentId: string,
        state: EquipmentState
    ) => Promise<EquipmentEntity | null>;
    getById: (id: string) => Promise<EquipmentEntity | null>;
    scheduleOrder: (input: {
        equipmentId: string;
        orderId: string;
    }) => Promise<void>;
}
