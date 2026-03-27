import http from "node:http";
import cors from "cors";
import express from "express";
import { equipmentService } from "./services/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/factory-floor/equipment", async (_request, response) => {
    response.json({
        equipment: await equipmentService.getAll()
    });
});

const server = http.createServer(app);
const port = 3000;

server.listen(port, () => {
    console.log(`factoryflow server listening on http://localhost:${port}`);
});
