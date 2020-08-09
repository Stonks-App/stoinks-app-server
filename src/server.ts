import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import * as Sentry from '@sentry/node';
import cors from 'cors';
const port = process.env.PORT || 4000;

Sentry.init({ dsn: 'https://50d76930b7304c4c94d6162db957ac8b@o425237.ingest.sentry.io/5364716' });

const typeDefs = gql`
	type Query {
		stocks: String
	}
`;

const resolvers = {
	Query: {
		stocks: () => {
			'FB';
		}
	}
};

const app = express();
const server = new ApolloServer({ typeDefs: typeDefs, resolvers: resolvers });

server.applyMiddleware({ app });
app.use(cors());

app.listen(port, () => {
	console.log(`🚀Server is ready at http://localhost:${port}${server.graphqlPath}`);
});