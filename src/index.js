import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/routes.js";
dotenv.config();

const server = express();

server.use(cors());
server.use(json());
server.use(router);

const PORT = process.env.PORT || 4000;
server.listen(PORT);
console.log(`Running on port ${PORT}`);