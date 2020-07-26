const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

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
