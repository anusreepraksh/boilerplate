import { createUser } from "./users.datasource";

export const resolvers = {
  Query: {
    // users: () => users
  },

  Mutation: {
    createUser: async (parent, { args }, { me, models }) => {
      return createUser(args);
    },
  },
};
