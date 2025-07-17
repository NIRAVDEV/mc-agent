import express from "express";
import { exec } from "child_process";

const app = express();
app.use(express.json());

const AGENT_TOKEN = process.env.AGENT_TOKEN || "replace_this_token";

app.post("/agent/start-server", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${AGENT_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { serverId, name, ram, port } = req.body;

  const containerName = `mc-${serverId}`;
  const memoryLimit = `${ram}m`; // Docker accepts memory like 1024m

  const cmd = `docker run -d --name ${containerName} --memory=${memoryLimit} -p ${port}:25565 itzg/minecraft-server`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr || error.message });
    }
    return res.json({ containerId: stdout.trim() });
  });
});

app.listen(8080, () => {
  console.log("Agent listening on port 8080");
});
