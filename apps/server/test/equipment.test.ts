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
            state: "yellow",
            scheduledOrders: []
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

    it("records history when state is updated", async () => {
        await equipmentService.updateState({
            equipmentId: "brick-molder-1",
            state: "red"
        });

        const history = equipmentService.getHistory();
        const lastEvent = history[history.length - 1];
        assert.ok(history.length > 0, "should have at least one history event");
        assert.strictEqual(lastEvent.equipmentId, "brick-molder-1");
        assert.strictEqual(lastEvent.toState, "red");
        assert.ok(lastEvent.fromState !== undefined);
    });

    it("does not record history when state is unchanged", async () => {
        const historySizeBefore = equipmentService.getHistory().length;

        await equipmentService.updateState({
            equipmentId: "brick-molder-1",
            state: "red"
        });

        const historySizeAfter = equipmentService.getHistory().length;

        assert.strictEqual(historySizeBefore, historySizeAfter);
    });

    it("allows a supervisor to schedule an order to equipment", async () => {
        const equipmentId = "brick-molder-1";
        const orderId = "order-1";
        await equipmentService.scheduleOrder({
            equipmentId,
            orderId
        });
        const allEquipment = await equipmentService.getAll();
        const equipment = allEquipment.find((e) => e.id === equipmentId);

        assert.ok(
            equipment.scheduledOrders.some((o) => o.id === orderId),
            "should have scheduled order"
        );
    });
});
