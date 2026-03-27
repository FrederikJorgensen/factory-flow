import {
    EquipmentRepository,
    EquipmentState
} from "../entities/equipment.entity.js";

type UpdateEquipmentStateInput = {
    equipmentId: string;
    state: EquipmentState;
};

export class EquipmentService {
    constructor(private readonly equipmentRepository: EquipmentRepository) {}

    getAll() {
        return this.equipmentRepository.getAll();
    }

    updateState({ equipmentId, state }: UpdateEquipmentStateInput) {
        return this.equipmentRepository.updateState(equipmentId, state);
    }
}
