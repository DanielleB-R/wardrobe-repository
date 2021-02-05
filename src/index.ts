import { APIGatewayProxyEvent, Context } from "aws-lambda";
import * as serverlessExpress from "aws-serverless-express";
import express from "express";

const createApp = (): express.Express => {
  const app = express();

  app.get("/", (_, res) => {
    res.send("Welcome!");
  });
  return app;
};

const app = createApp();
const serverlessApp = serverlessExpress.createServer(app);

export async function handler(event: APIGatewayProxyEvent, context: Context) {
  return serverlessExpress.proxy(serverlessApp, event, context, "PROMISE")
    .promise;
}
