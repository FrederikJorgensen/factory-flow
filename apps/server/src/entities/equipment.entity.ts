export type EquipmentState = "red" | "yellow" | "green";

export type EquipmentEntity = {
    id: string;
    name: string;
    state: EquipmentState;
};

export interface EquipmentRepository {
    getAll: () => Promise<EquipmentEntity[]>;
    updateState: (
        equipmentId: string,
        state: EquipmentState
    ) => Promise<EquipmentEntity | null>;
}
