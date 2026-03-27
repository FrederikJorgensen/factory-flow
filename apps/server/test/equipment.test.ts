import { describe, it } from "node:test";
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
});
