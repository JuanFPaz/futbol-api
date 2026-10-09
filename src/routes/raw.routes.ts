import express from "express";
import {
  fixture_rounds,
  fixtures,
  league,
  standings,
  teams,
} from "../controller/raw.controller.js";

const rawRouter = express.Router();

rawRouter.post("/leagues", league);

rawRouter.post("/teams", teams);

rawRouter.post("/standings", standings);

rawRouter.post("/fixtures", fixtures);

rawRouter.post("/fixtures/rounds", fixture_rounds);

export default rawRouter