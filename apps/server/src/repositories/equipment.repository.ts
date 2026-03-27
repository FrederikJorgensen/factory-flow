import {
    EquipmentEntity,
    EquipmentRepository,
    EquipmentState
} from "../entities/equipment.entity.js";

const seedEquipment: EquipmentEntity[] = [
    { id: "brick-molder-1", name: "Brick Molder #1", state: "green" },
    { id: "brick-molder-2", name: "Brick Molder #2", state: "yellow" },
    { id: "assembly-line-1", name: "Assembly Line A", state: "red" },
    { id: "quality-control-unit", name: "Quality Control Unit", state: "green" }
];

export class InMemoryEquipmentRepository implements EquipmentRepository {
    private equipment: EquipmentEntity[] = structuredClone(seedEquipment);

    async getAll() {
        return this.equipment;
    }

    async updateState(equipmentId: string, state: EquipmentState) {
        const equipmentToUpdate = this.equipment.find(
            (item) => item.id === equipmentId
        );

        if (!equipmentToUpdate) {
            return null;
        }

        equipmentToUpdate.state = state;

        return equipmentToUpdate;
    }
}
