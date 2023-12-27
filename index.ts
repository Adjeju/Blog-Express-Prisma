import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes";
import bodyParser from "body-parser";
import { errorHandler } from "./middlewares";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(router);
app.use(errorHandler);
//TODO: add morgan and winston

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!!!");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
