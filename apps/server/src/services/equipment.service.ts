import { EquipmentRepository } from "../entities/equipment.entity.js";

export class EquipmentService {
    constructor(private readonly equipmentRepository: EquipmentRepository) {}

    getAll() {
        return this.equipmentRepository.getAll();
    }
}
