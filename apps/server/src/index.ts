import http from "node:http";
import cors from "cors";
import express from "express";
import { EquipmentEntity, equipmentService } from "./services/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/factory-floor/equipment", async (_request, response) => {
    response.json({
        equipment: await equipmentService.getAll()
    });
});

app.put("/api/factory-floor/state", async (request, response) => {
    const { equipmentId, state } = request.body as {
        equipmentId?: string;
        state?: EquipmentEntity["state"];
    };

    if (!equipmentId || !state) {
        response.status(400).json({
            ok: false,
            error: "equipmentId and state are required"
        });
        return;
    }

    const updatedEquipment = await equipmentService.updateState({
        equipmentId,
        state
    });

    if (!updatedEquipment) {
        response.status(404).json({
            ok: false,
            error: "Equipment not found"
        });
        return;
    }

    response.json({
        ok: true,
        equipment: updatedEquipment
    });
});

app.get("/api/factory-floor/history", (_request, response) => {
    response.json({
        events: equipmentService.getHistory()
    });
});

const server = http.createServer(app);
const port = 3000;

server.listen(port, () => {
    console.log(`factoryflow server listening on http://localhost:${port}`);
});
