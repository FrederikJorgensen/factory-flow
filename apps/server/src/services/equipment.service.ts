import {
    EquipmentRepository,
    EquipmentState
} from "../entities/equipment.entity.js";

type UpdateEquipmentStateInput = {
    equipmentId: string;
    state: EquipmentState;
};

interface StateChangeEvent {
    id: string;
    equipmentId: string;
    equipmentName: string;
    fromState: EquipmentState;
    toState: EquipmentState;
    timestamp: string;
}

export class EquipmentService {
    private events: StateChangeEvent[] = [];
    private nextId = 1;

    constructor(private readonly equipmentRepository: EquipmentRepository) {}

    getAll() {
        return this.equipmentRepository.getAll();
    }

    getHistory() {
        return this.events;
    }

    async updateState({ equipmentId, state }: UpdateEquipmentStateInput) {
        const previous = await this.equipmentRepository.getById(equipmentId);
        const updated = await this.equipmentRepository.updateState(
            equipmentId,
            state
        );

        if (previous && updated && previous.state !== updated.state) {
            this.events.push({
                id: String(this.nextId++),
                equipmentId,
                equipmentName: updated.name,
                fromState: previous.state,
                toState: updated.state,
                timestamp: new Date().toISOString()
            });
        }

        if (
            state === "green" &&
            updated &&
            updated.scheduledOrders.length > 0
        ) {
            await this.equipmentRepository.promoteNextOrder(equipmentId);
        }

        return this.equipmentRepository.getById(equipmentId);
    }

    async scheduleOrder(input: { equipmentId: string; orderId: string }) {
        return await this.equipmentRepository.scheduleOrder(input);
    }
}
