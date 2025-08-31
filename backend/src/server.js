import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./middleware/rateLimiter.js";
import routes from "./routes/index.js";
import { connectDb } from "./config/db.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

// GraphQL imports
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/schema/typeDefs.js";
import { resolvers } from "./graphql/schema/resolvers.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import { authRequired } from "./middleware/auth.js";

dotenv.config();
const app = express();

// ✅ Correct CORS setup
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true, // important for cookies/auth
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter(240));

// REST routes
app.use("/api", routes);

// Connect DB
connectDb();

const schema = makeExecutableSchema({ typeDefs, resolvers });
const httpServer = createServer(app);

// ✅ WebSocket server for GraphQL subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

useServer(
  {
    schema,
    context: async (ctx) => {
      let user = null;
      try {
        const authHeader = ctx.connectionParams?.authorization || "";
        if (authHeader.startsWith("Bearer ")) {
          const token = authHeader.replace("Bearer ", "");
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          user = await User.findById(decoded.uid).select(
            "_id name email avatar"
          );
        }
      } catch (err) {
        console.warn("Subscription auth failed:", err.message);
      }
      return { user }; // 👈 context for subscriptions
    },
  },
  wsServer
);

const apolloServer = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

await apolloServer.start();

app.use(
  "/graphql",
  express.json(),
  authRequired, // 👈 will attach req.user
  expressMiddleware(apolloServer, {
    context: async ({ req, res }) => ({
      req,
      res,
      user: req.user, // 👈 now resolvers get `context.user`
    }),
  })
);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 REST at http://localhost:${PORT}/api`);
  console.log(`🚀 GraphQL at http://localhost:${PORT}/graphql`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql`);
});

// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import { rateLimiter } from "./middleware/rateLimiter.js";
// import routes from "./routes/index.js";
// import { connectDb } from "./config/db.js";

// // GraphQL imports
// import { ApolloServer } from "@apollo/server";
// import { typeDefs } from "./graphql/schema/typeDefs.js";
// import { resolvers } from "./graphql/schema/resolvers.js";
// import { makeExecutableSchema } from "@graphql-tools/schema";
// import { createServer } from "http";
// import { WebSocketServer } from "ws";
// import { useServer } from "graphql-ws/use/ws";
// import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
// import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
// import { expressMiddleware } from "@as-integrations/express5";
// import { authRequired } from "./middleware/auth.js";
// dotenv.config();
// const app = express();

// // ✅ Correct CORS setup
// app.use(
//   cors({
//     origin: "http://localhost:3002", // frontend URL
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(cookieParser());
// app.use(rateLimiter(240));

// // REST routes
// app.use("/api", routes);

// // Connect DB
// connectDb();

// const schema = makeExecutableSchema({ typeDefs, resolvers });

//   const httpServer = createServer(app);

//   // ✅ WebSocket server for GraphQL subscriptions
//   const wsServer = new WebSocketServer({
//     server: httpServer,
//     path: "/graphql",
//   });

//   useServer({ schema }, wsServer);

//   const apolloServer = new ApolloServer({
//     schema,
//     plugins:[
//         ApolloServerPluginDrainHttpServer({ httpServer }),
//         ApolloServerPluginLandingPageLocalDefault({ embed: true }),
//     ]
//   });

//   await apolloServer.start();

//     app.use("/graphql",
//     express.json(),
//     authRequired,
//     expressMiddleware(apolloServer, {
//       context: async ({ req, res }) => ({ req, res }),
//     }));

//   const PORT = process.env.PORT || 4000;
//   httpServer.listen(PORT, () => {
//     console.log(`🚀 REST at http://localhost:${PORT}/api`);
//     console.log(`🚀 GraphQL at http://localhost:${PORT}/graphql`);
//     console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql`);
//   });
