import express from "express";
import dotenv from "dotenv";
import { verifyTokenHandler } from "./lib/handlers/verifyToken";
import { startServerHandler } from "./lib/handlers/startServer";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 2022;

// Token verification
app.post("/api/agent/verify-token", verifyTokenHandler);

// Start a Minecraft server
app.post("/api/agent/start-server", startServerHandler);

app.listen(PORT, () => {
  console.log(`Agent listening on port ${PORT}`);
});
