import { describe, it } from "node:test";
import { EquipmentEntity } from "../src/entities/equipment.entity.js";
import * as assert from "node:assert";
import { equipmentService } from "../src/services";

describe("Equipment", () => {
    it("lists all equipment", async () => {
        const result = await equipmentService.getAll();
        assert.ok(
            result.length > 0,
            "should return at least one equipment item"
        );
    });

    it("updates the state of the equipment", async () => {
        const updatedEquipment: EquipmentEntity = {
            id: "brick-molder-1",
            name: "Brick Molder #1",
            state: "yellow"
        };

        await equipmentService.updateState({
            equipmentId: updatedEquipment.id,
            state: updatedEquipment.state
        });

        const allEquipment = await equipmentService.getAll();
        const equipment = allEquipment.find(
            (e) => e.id === updatedEquipment.id
        );

        assert.strictEqual(equipment.state, updatedEquipment.state);
    });
});
