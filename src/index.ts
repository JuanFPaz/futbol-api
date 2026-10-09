import express, { Application, Request, Response } from "express";
import rawRouter from "./routes/raw.routes.js";
import viewRouter from "./routes/view.routes.js";
import { prueba } from "./app/probando.js";

const app: Application = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  prueba()
  
  res.json({ message: "Hola" });
});

app.use(rawRouter);
app.use(viewRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
