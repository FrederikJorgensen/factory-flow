export type EquipmentState = "red" | "yellow" | "green";

type Order = { id: string; name: string };
export type EquipmentEntity = {
    id: string;
    name: string;
    state: EquipmentState;
    scheduledOrders: Order[];
    currentOrder?: Order;
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
    }) => Promise<EquipmentEntity>;
    promoteNextOrder: (equipmentId: string) => Promise<void>;
}
