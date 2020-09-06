require('dotenv').config();
//Server import
import express from 'express';
import cors from 'cors';
//GQL imports
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { typeDefs, resolvers, dataSources } from './gqlModules/gqlBase';
const port = process.env.PORT || 4000;
import logger from './utils/log/logger';

import connect from './db/mongoConnection';
//@ts-ignore
import mongoURI from './db/config';

// import { startDiscordJob } from './jobs/jobs';

const schema = makeExecutableSchema({
	typeDefs,
	// @ts-ignore
	resolvers
});

const app = express();
const server = new ApolloServer({
	schema,
	dataSources,
	playground: true,
	introspection: true
});

server.applyMiddleware({ app });
app.use(cors());

const db: any = mongoURI;
connect(db);

// startDiscordJob();

app.listen(port, () => {
	if (process.env.NODE_ENV === 'development') {
		logger.info(`🚀Development Server is ready at http://localhost:${port}${server.graphqlPath}`);
	}
	else {
		logger.info(`🚀Production Server is ready at http://localhost:${port}${server.graphqlPath}`);
	}
});
