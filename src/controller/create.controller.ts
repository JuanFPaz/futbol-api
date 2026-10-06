import { Request, Response } from "express";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import axios from "axios";
import configAxios from "../helpers/configAxios.js";
import CreateService from "../service/create.service.js";

export const league = async (req: Request, res: Response) => {
  const { country, abbr } = req.body;
  try {
    await CreateService.CreateLeague(country,abbr,'league.json')
    res.json({ status: 201, message: "Recurso creado " });
  } catch (error) {
    res.status(500).json({ status: 500, message: (error as Error).message });
  }
};

export const teams = async (req: Request, res: Response) => {
  const { id, season } = req.body;
  try {
    const { data } = await axios(
      configAxios(`/teams?league=${id}&season=${season}`),
    );
    res.json({ status: 200, message: "Recurso creado (?", data });
  } catch (error) {}
};

export const standings = async (req: Request, res: Response) => {
  const { id, season, league, country } = req.body;

  try {
    const { data } = await axios(
      configAxios(`/standings?league=${id}&season=${season}`),
    );
    const PATH = join(
      process.cwd(),
      "src",
      "api",
      country,
      String(season),
      league,
      "standings.json",
    );
    await writeFile(PATH, JSON.stringify(data));
    res.json({ status: 200, message: "Recurso Creado" });
  } catch (error) {}
};

export const fixtures = async (req: Request, res: Response) => {
  const { id, season, country, league } = req.body;

  const PATH = join(
    process.cwd(),
    "src",
    "api",
    country,
    String(season),
    league,
    "fixture.json",
  );
  const { data } = await axios(
    configAxios(`/fixtures?league=${id}&season=${season}`),
  );
  await writeFile(PATH, JSON.stringify(data));
  res.json({ status: 200, message: "Recurso Creado" });
};

export const fixture_rounds = async (req: Request, res: Response) => {
  const { id, season, country, league } = req.body;

  const PATH = join(
    process.cwd(),
    "src",
    "api",
    country,
    String(season),
    league,
    "fixture-rounds.json",
  );
  const { data } = await axios(
    configAxios(`/fixtures/rounds?league=${id}&season=${season}`),
  );
  await writeFile(PATH, JSON.stringify(data));
  res.json({ status: 200, message: "Recurso Creado" });
};
