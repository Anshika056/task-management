// schema.ts
import { makeExecutableSchema } from '@graphql-tools/schema';

const typeDefs = `
  type Task {
    id: ID!
    title: String!
    author: String!
    description: String
  }

  type Query {
    searchTasks(title: String, author: String): [Task]
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: require('./resolver').default,
});

export default schema;
