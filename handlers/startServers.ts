import Docker from "dockerode";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

interface StartServerPayload {
  serverId: string;
}

export async function handleStartServer(payload: StartServerPayload) {
  const { serverId } = payload;

  const containerName = `mc-server-${serverId}`;

  try {
    // Check if the container already exists
    let container = docker.getContainer(containerName);
    const containerInfo = await container.inspect().catch(() => null);

    if (containerInfo) {
      // If exists but not running, start it
      if (containerInfo.State.Status !== "running") {
        await container.start();
        return { success: true, message: "Container started (existing)." };
      } else {
        return { success: true, message: "Container already running." };
      }
    }

    // If not exists, create and start a new container
    container = await docker.createContainer({
      Image: "itzg/minecraft-server", // Customize this base image
      name: containerName,
      Env: [
        "EULA=TRUE",
        "MEMORY=2G", // Adjust based on server config
        `SERVER_NAME=${serverId}`,
      ],
      HostConfig: {
        RestartPolicy: {
          Name: "unless-stopped",
        },
        PortBindings: {
          "25565/tcp": [
            {
              HostPort: "0", // Let Docker assign a random port or handle mapping logic later
            },
          ],
        },
      },
    });

    await container.start();

    return { success: true, message: "Container created and started." };
  } catch (err: any) {
    console.error("Error starting server:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}
