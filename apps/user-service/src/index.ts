// const app: express.Application = express();
// const port = 3000;

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

// The ApolloServer constructor requires two parameters: your schema

// npm install @apollo/server express graphql cors

// import { ApolloServer } from "@apollo/server";
// import { expressMiddleware } from "@apollo/server/express4";
// import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
// import express from "express";
// import http from "http";
// import cors from "cors";

// import { resolvers } from "./users/users.resolver";
// import { typeDefs } from "./books/schema";

// interface MyContext {
//   token?: String;
// }
// async function ApolloServerStart() {
//   const app = express();
//   const httpServer = http.createServer(app);
//   const server = new ApolloServer<MyContext>({
//     typeDefs,
//     resolvers,
//     plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   });
//   await server.start();
//   app.use(
//     "/graphql",
//     cors<cors.CorsRequest>(),
//     express.json(),
//     expressMiddleware(server, {
//       context: async ({ req }) => ({ token: req.headers.token }),
//     })
//   );

//   await new Promise<void>((resolve) =>
//     httpServer.listen({ port: 4000 }, resolve)
//   );
//   console.log(`🚀 Server ready at http://localhost:4000/graphql`);
// }
// ApolloServerStart();
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";

import { resolvers } from "./users/users.resolver"; // Assuming resolvers are in users.resolver
// Assuming schema is in users.schema (update path if different)
import { typeDefs } from "./users/users.graphql";

interface MyContext {
  token?: String;
}

async function ApolloServerStart() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(` Server ready at http://localhost:4000/graphql`);
}

ApolloServerStart();
