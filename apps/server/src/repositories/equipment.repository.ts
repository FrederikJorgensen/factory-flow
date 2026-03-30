import {
    EquipmentEntity,
    EquipmentRepository,
    EquipmentState
} from "../entities/equipment.entity.js";

const seedEquipment: EquipmentEntity[] = [
    {
        id: "brick-molder-1",
        name: "Brick Molder #1",
        state: "green",
        scheduledOrders: []
    },
    {
        id: "brick-molder-2",
        name: "Brick Molder #2",
        state: "yellow",
        scheduledOrders: []
    },
    {
        id: "assembly-line-1",
        name: "Assembly Line A",
        state: "red",
        scheduledOrders: []
    },
    {
        id: "quality-control-unit",
        name: "Quality Control Unit",
        state: "green",
        scheduledOrders: []
    }
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

    async getById(id: string) {
        const equipment = this.equipment.find((e) => e.id === id);
        return equipment ? { ...equipment } : null;
    }

    async scheduleOrder(input: { equipmentId: string; orderId: string }) {
        const equipment = this.equipment.find(
            (e) => e.id === input.equipmentId
        );
        if (!equipment) throw new Error("Equipment not found");
        equipment.scheduledOrders.push({
            id: input.orderId,
            name: `Order ${input.orderId} for ${equipment.name}`
        });
    }
}
