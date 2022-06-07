import express, { Express } from "express";
import middlewares from "./middlewares";
import seedController from "./controllers/seed.controller";
import dotenv from "dotenv";
import { admin_router } from "./router";

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 8080;

app.use(...middlewares);

seedController.createSeedDatabase();

app.use("/api/", [admin_router]);

app.listen(port, () => {
    console.log(`[ʂҽɾѵҽɾ 👹]: Server is running at http://localhost:${port}`);
});
