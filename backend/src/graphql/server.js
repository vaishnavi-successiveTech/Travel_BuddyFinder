import jwt from "jsonwebtoken";
export async function startApollo(app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
      // read cookie token like REST
      const token = req.cookies?.token;
      if (token) {
        try { req.userId = jwt.verify(token, process.env.JWT_SECRET).uid; } catch {}
      }
      return { req, res };
    }
  });
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
}
