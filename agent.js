import axios from 'axios';
import express from 'express';
import { exec } from 'child_process';

const token = process.env.NODE_TOKEN; // should be securely set
const panelUrl = process.env.PANEL_URL || 'http://localhost:3000';

async function verifyToken() {
  try {
    const res = await axios.post(`${panelUrl}/api/agent/verify-token`, { token });
    console.log("✅ Token verified:", res.data);
    return true;
  } catch (err) {
    console.error("❌ Token verification failed:", err.response?.data || err.message);
    return false;
  }
}

// Temporary: Express server to accept start/stop
const app = express();
app.use(express.json());

app.post('/start', async (req, res) => {
  const { containerId } = req.body;
  exec(`docker start ${containerId}`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    res.json({ message: stdout });
  });
});

app.post('/stop', async (req, res) => {
  const { containerId } = req.body;
  exec(`docker stop ${containerId}`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    res.json({ message: stdout });
  });
});

(async () => {
  const verified = await verifyToken();
  if (!verified) return process.exit(1);

  app.listen(8080, () => {
    console.log("Agent listening on port 8080");
  });
})();
