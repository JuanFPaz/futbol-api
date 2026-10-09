import { Request, Response } from "express";
import RawService from "../service/raw.service.js";
import { RequestGenericRaw, RequestLeagueRaw } from "../types/raw.types.js";

export const league = async (req: Request, res: Response) => {
  const LeagueBody:RequestLeagueRaw = req.body;
  try {
    await RawService.CreateLeague(LeagueBody);
    res.json({ status: 201, message: "Recurso creado" });
  } catch (error) {
    res.status(500).json({ status: 500, message: (error as Error).message });
  }
};

export const teams = async (req: Request, res: Response) => {
  const TeamBody:RequestGenericRaw = req.body;
  
  try {
    await RawService.CreateTeams(TeamBody);
    res.json({ status: 201, message: "Recurso creado" });
  } catch (error) {
    res.status(500).json({ status: 500, message: (error as Error).message });
  }
};

export const standings = async (req: Request, res: Response) => {
  const StandingsBody:RequestGenericRaw = req.body;

  try {
    await RawService.CreateStandings(StandingsBody)
    res.json({ status: 201, message: "Recurso Creado" });
  } catch (error) {
    res.status(500).json({ status: 500, message: (error as Error).message });
  }
};

export const fixtures = async (req: Request, res: Response) => {
  const FixturesBody:RequestGenericRaw = req.body;

  try {
    await RawService.CreateFixtures(FixturesBody)
    res.json({ status: 201, message: "Recurso Creado" });
  } catch (error) {
    res.status(500).json({ status: 500, message: (error as Error).message });
  }
};

export const fixture_rounds = async (req: Request, res: Response) => {
  const FixturesBody:RequestGenericRaw = req.body;

  try {
    await RawService.CreateFixturesRounds(FixturesBody)
    res.json({ status: 201, message: "Recurso Creado" });
  } catch (error) {
    res.status(500).json({ status: 500, message: (error as Error).message });
  }
};
