import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { schema } from './schema';
import { context } from './context';

export const server = new ApolloServer({
  schema,
  context,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  cors: {
    origin: '*',
    credentials: true,
  },
});

const port = process.env.PORT || 8000;

server.listen({ port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
