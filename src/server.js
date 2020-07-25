const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

const port = process.env.PORT || 4000;

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
