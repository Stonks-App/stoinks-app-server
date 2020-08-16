require('dotenv').config();
import express from 'express';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import * as Sentry from '@sentry/node';
import cors from 'cors';
const port = process.env.PORT || 4000;

import { typeDefs, resolvers, dataSources } from './gqlModules/gqlBase';

Sentry.init({ dsn: 'https://50d76930b7304c4c94d6162db957ac8b@o425237.ingest.sentry.io/5364716' });

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
});

const app = express();
app.use(cors());
const server = new ApolloServer({
	schema,
	dataSources,
	playground: true,
	introspection: true
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen(port, () => {
	console.log(`🚀Server is ready at http://localhost:${port}${server.graphqlPath}`);
});
