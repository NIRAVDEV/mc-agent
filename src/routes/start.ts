// agent/src/routes/start.ts
import { FastifyInstance } from "fastify";
import Docker from "dockerode";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

export default async function startRoutes(app: FastifyInstance) {
  app.post("/start", async (req, res) => {
    const { serverId } = req.body as { serverId: string };

    if (!serverId) {
      return res.status(400).send({ error: "Missing serverId" });
    }

    const containerName = `mc-${serverId}`;
    const image = "itzg/minecraft-server";

    try {
      // Check if the container already exists
      const containers = await docker.listContainers({ all: true });
      const existing = containers.find(c =>
        c.Names.includes(`/${containerName}`)
      );

      let container;
      if (existing) {
        container = docker.getContainer(existing.Id);
        await container.start();
      } else {
        container = await docker.createContainer({
          Image: image,
          name: containerName,
          Tty: true,
          Env: ["EULA=TRUE"],
          HostConfig: {
            PortBindings: {
              "25565/tcp": [{ HostPort: "" }],
            },
            RestartPolicy: {
              Name: "unless-stopped",
            },
          },
        });
        await container.start();
      }

      res.send({ success: true, containerId: container.id });
    } catch (err) {
      console.error("Failed to start server:", err);
      res.status(500).send({ error: "Failed to start server" });
    }
  });
}
