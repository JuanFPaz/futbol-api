import { Request, Response } from "express";
import { RequestCreateView, RequestUpdateView } from "../types/view.types.js";
import ViewService from "../service/view.service.js";


export const createFixtures = async (req: Request, res: Response) => {
  const FixturesBody: RequestCreateView = req.body;
  try {
    await ViewService.createFixture(FixturesBody);
    res.json({ status: 201, message: "Recurso Creado" });
  } catch (error) {
    res.status(500).json({ status: 500, message: (error as Error).message });
  }
};

export const createTablaAnual = async (req: Request, res: Response) => {
  const TablaBody: RequestCreateView = req.body;
  try {
    await ViewService.createTablaAnual(TablaBody);
    res.json({ status: 201, message: "Recurso Creado" });
  } catch (error) {
    res.status(500).json({ status: 500, message: (error as Error).message });
  }
};

export const updateTablaAnual = async (req: Request, res: Response) => {
  const TablaBody:RequestUpdateView = req.body;
  try {

    await ViewService.updateTablas(TablaBody)
    res.json({ status: 201, message: "Recurso Creado" });
  } catch (error) {
    res.status(500).json({ status: 500, message: (error as Error).message });
  }
};
