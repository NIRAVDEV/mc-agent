import { exec } from "child_process";

export function startDockerContainer(id: string, name: string, ram: number, version: string, port: number) {
  return new Promise((resolve, reject) => {
    const command = `
      docker run -d \
      --name server-${id} \
      -p ${port}:25565 \
      -e EULA=TRUE \
      -e MEMORY=${ram}M \
      itzg/minecraft-server \
      --name ${name} \
      --version ${version}
    `;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Docker error:", stderr);
        return reject(error);
      }
      console.log("Container started:", stdout);
      resolve(stdout);
    });
  });
}
