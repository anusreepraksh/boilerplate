import { buildSubgraphSchema } from "@apollo/subgraph";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
// import {
//   authDirectiveTransformer,
//   authorizeDirectiveTransformer,
//   cacheDirectiveTransformer,
// } from "shared-backend";
import {
  GraphQLDateTime,
  GraphQLEmailAddress,
  GraphQLJSON,
} from "graphql-scalars";
import path from "path";
import { TModule, UserServiceContext } from "../index";
import UsersDataSource from "./users/users.datasource";
import { UserModel } from "./users/users.model";

const typeDefs = mergeTypeDefs(
  loadFilesSync(path.resolve(__dirname + "/**/*.graphql"), {
    extensions: ["graphql"],
  })
);
const resolvers = mergeResolvers(
  loadFilesSync(path.resolve(__dirname + "/**/*.resolver.{ts,js}"), {
    extensions: ["ts", "js"],
  })
);

export const Modules: TModule = {
  models: {
    userModel: UserModel,
  },
  datasources: {
    userDataSources: new UsersDataSource(),
  },
  schemas:
    //   cacheDirectiveTransformer(
    //     authDirectiveTransformer<MyContext>(
    //   authorizeDirectiveTransformer<MyContext>(
    buildSubgraphSchema([
      {
        typeDefs,
        resolvers: {
          ...resolvers,
          ...{ JSON: GraphQLJSON },
          ...{ EmailAddress: GraphQLEmailAddress },
          ...{ DateTime: GraphQLDateTime },
        },
      },
    ]),
  //       )
  //     )
  //   ),
};
