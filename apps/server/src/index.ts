import http from "node:http";
import cors from "cors";
import express from "express";
import { WebSocketServer } from "ws";
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

    // broadcast update
    broadcast({
        type: "equipment:update",
        payload: updatedEquipment
    });

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

app.post("/api/factory-floor/orders", async (request, response) => {
    const { equipmentId, orderId } = request.body as {
        equipmentId?: string;
        orderId?: string;
    };

    if (!equipmentId || !orderId) {
        response.status(400).json({
            ok: false,
            error: "equipmentId and orderId are required"
        });
        return;
    }

    const updated = await equipmentService.scheduleOrder({
        equipmentId,
        orderId
    });

    broadcast({ type: "equipment:update", payload: updated });

    response.json({ ok: true, equipment: updated });
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const clients = new Set<WebSocket>();

wss.on("connection", (ws) => {
    clients.add(ws);

    ws.on("close", () => {
        clients.delete(ws);
    });
});

function broadcast(message: unknown) {
    const data = JSON.stringify(message);

    for (const client of clients) {
        if (client.readyState === client.OPEN) {
            client.send(data);
        }
    }
}

const port = 3000;

server.listen(port, () => {
    console.log(`factoryflow server listening on http://localhost:${port}`);
});
