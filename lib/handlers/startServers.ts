import { Request, Response } from "express";
import { startDockerContainer } from "../docker";

export const startServerHandler = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (token !== process.env.NODE_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id, name, ram, version, port } = req.body;

  try {
    await startDockerContainer(id, name, ram, version, port);
    return res.status(200).json({ message: "Container started" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to start container" });
  }
};
