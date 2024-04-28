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
import express, { Request } from "express";
import http from "http";
import cors from "cors";

import { UserModel } from "./modules/users/users.model";
import UserDatasource from "./modules/users/users.datasource";
import jwt from "jsonwebtoken";
import { Modules } from "./modules";
import { split } from "lodash";
import { GraphQLSchema } from "graphql";

type JWTPayload = {
  userId: String;
  deviceDocId: String;
};
type TModelContext = {
  userModel: typeof UserModel;
};
type TCurrentUser = {
  _id: String;
  firstName: String;
  lastName: String | null;
  email: String | null;
  phoneNumber: String | null;
  gender: String;
  dateOfBirth: String;
};
type TDataSourceContext = {
  userDataSources: UserDatasource;
};
export type TModule = {
  datasources: TDataSourceContext;
  models: TModelContext;
  schemas: GraphQLSchema;
};
export type Nullable<T> = T | null;

export type UserServiceContext = {
  token?: String;
  // me: Nullable<JWTPayload>;
  // models: TModelContext;
  //currentUser?: TCurrentUser;
  // datasources: TDataSourceContext;
};
export const TokenVerify = (req: Request) => {
  try {
    const accessToken = req?.headers?.authorization;
    const [bearer, token] = split(accessToken, " ");
    if (accessToken && bearer && token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string);
      return payload as JWTPayload;
    }
  } catch (err) {}
  return null;
};
async function ApolloServerStart() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer<UserServiceContext>({
    schema: Modules.schemas,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async (payload) => {
        return {
          token: payload.req.headers.token,
          // me: TokenVerify(payload.req),
          // models: Modules.models,
          // datasources: Modules.datasources,
        };
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(` Server ready at http://localhost:4000/graphql`);
}

ApolloServerStart();
