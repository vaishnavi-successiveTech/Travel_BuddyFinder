import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import cors from "cors";
import { makeExecutableSchema } from "@graphql-tools/schema";
import jwt from "jsonwebtoken";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

import { pubsub } from "./pubsub.js"; // Import pubsub instance

import { typeDefs } from "../schema/typeDefs.js";
import { resolvers } from "../resolvers.js";
import { userInfo } from "os";

const SECRET = process.env.JWT_SECRET || "supersecret";


export async function createExpressServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Build executable schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Apollo Server setup
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();

  // Attach HTTP middleware
  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
         context: ({ req }) => {
      const token = req.headers.authorization || "";
      if(!token){
        return {user:null,pubsub};
      }
      const userExist = jwt.verify(token,"MY_SECRET_KEY");
      console.log("userExist role",userExist);
      return { pubsub,userExist };
    },
  
    })
  );

  // WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  useServer(
    {
      schema,
      context: async () => ({ pubsub }), //  inject pubsub in WS context
    },
    wsServer
  );

  return httpServer;
}

export const createApolloServer = createExpressServer;