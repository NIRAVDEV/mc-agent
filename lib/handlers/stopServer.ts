import { Request, Response } from "express";
import { verifyToken } from "../utils/verifyToken";
import { docker } from "../utils/docker";

export const stopServerHandler = async (req: Request, res: Response) => {
  if (!verifyToken(req)) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing server ID" });

  try {
    const container = docker.getContainer(`mc_${id}`);
    await container.stop();
    res.status(200).json({ message: "Server stopped" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
