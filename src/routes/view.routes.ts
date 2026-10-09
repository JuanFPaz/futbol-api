import express from "express";
import {
  createFixtures,
  createTablaAnual,
  updateTablaAnual,
} from "../controller/view.controller.js";

const viewRouter = express.Router();

viewRouter.post("/create/fixtures", createFixtures);

viewRouter.post("/create/tabla-anual", createTablaAnual);

viewRouter.post("/update/tabla-anual", updateTablaAnual);

export default viewRouter;
