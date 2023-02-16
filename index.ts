import express, { Application } from "express";
import { appConfig } from "./app";
import { dbConfig } from "./config/DB";
import { envVariables } from "./config/environmentVariables";

const port = envVariables.PORT;

const app: Application = express();

appConfig(app);
dbConfig();
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
