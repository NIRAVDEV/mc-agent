import { Request, Response } from "express";

export const verifyTokenHandler = (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (token === process.env.NODE_TOKEN) {
    return res.status(200).json({ valid: true });
  } else {
    return res.status(401).json({ valid: false, message: "Invalid token" });
  }
};
