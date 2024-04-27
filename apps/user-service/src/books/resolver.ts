import { books } from "./schema";

export const resolvers = {
  Query: {
    books: () => books,
  },
};
