import { EquipmentService } from "./equipment.service.js";
import { InMemoryEquipmentRepository } from "../repositories/equipment.repository.js";

export type { EquipmentEntity } from "../entities/equipment.entity.js";

const equipmentRepository = new InMemoryEquipmentRepository();
export const equipmentService = new EquipmentService(equipmentRepository);
