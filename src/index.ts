import { APIGatewayProxyEvent, Context } from "aws-lambda";
import * as serverlessExpress from "aws-serverless-express";
import express from "express";
import pinoHttp from "pino-http";

import graphqlHandler from "./graphql";

const createApp = (): express.Express => {
  const app = express();

  app.use(
    pinoHttp({ enabled: true }),
    express.json({ limit: "6MB" }) // Lambda has a payload size limit of 6MB
  );

  app.use("/", graphqlHandler);

  return app;
};

const app = createApp();
const serverlessApp = serverlessExpress.createServer(app);

export async function handler(event: APIGatewayProxyEvent, context: Context) {
  return serverlessExpress.proxy(serverlessApp, event, context, "PROMISE")
    .promise;
}

if (process.env.LOCAL_DEV) {
  app.listen(8912);
}
