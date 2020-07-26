const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const Sentry = require('@sentry/node');
const cors = require('cors');

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

module.exports = { app, server };
