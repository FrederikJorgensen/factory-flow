import http from "node:http";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const port = 3000;

server.listen(port, () => {
    console.log(`factoryflow server listening on http://localhost:${port}`);
});
