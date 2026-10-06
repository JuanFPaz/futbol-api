import express, { Request, Response } from "express";
import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import main from "../app/sumatoria.js";

const router = express.Router();

router.post("/update/tabla-anual", async (req: Request, res: Response) => {
  const { country, season, league, tournament } = req.body;

  await main(country, String(season), league, tournament);

  res.json({ status: 200, message: "Recurso Creado" });
});


export default router