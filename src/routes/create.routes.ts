import express, { Request, Response } from "express";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import axios from "axios";
import main, { FixtureGeneric } from "../app/main.js";
import miau, { tablaAnualDos } from "../app/tabla-anual.js";
import {
  fixture_rounds,
  fixtures,
  league,
  standings,
  teams,
} from "../controller/create.controller.js";

const router = express.Router();

router.post("/leagues", league);

router.post("/teams", teams);

router.post("/standings", standings);

router.post("/fixtures", fixtures);

router.post("/fixtures/rounds", fixture_rounds);

router.post("/create/fixtures", async (req: Request, res: Response) => {
  const { country, season, league, tournament } = req.body;

  if (season === 2026) {
    await main(country, String(season), league, tournament);
  }

  if (season === 2025) {
    await FixtureGeneric(country, String(season), league, tournament);
  }
  res.json({ status: 200, message: "Recurso Creado" });
});

router.post("/create/tabla-anual", async (req: Request, res: Response) => {
  const { country, season, league, tournament } = req.body;

  if (season === 2026) {
    await miau(country, String(season), league, tournament);
  }

  if (season === 2025) {
    await tablaAnualDos(country, String(season), league, tournament);
  }

  res.json({ status: 200, message: "Recurso Creado" });
});

export default router;
