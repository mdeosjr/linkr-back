import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/routes.js"
import path from "path";
dotenv.config();

const server = express();

server.use(cors());
server.use(json());
server.use(router);
server.use("/assets", express.static(path.join(path.dirname("."), "/src/assets")));

const PORT = process.env.PORT || 5000;
server.listen(PORT);