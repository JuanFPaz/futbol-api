import express, { Application } from "express";
import createRoutes from "./routes/create.routes.js";
import updateRoutes from "./routes/update.routes.js"

const app: Application = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(createRoutes);
app.use(updateRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
