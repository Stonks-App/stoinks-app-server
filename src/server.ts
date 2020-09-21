require('dotenv').config();
//Server import
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
//GQL imports
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { typeDefs, resolvers, dataSources } from './gqlModules/gqlBase';
const port = process.env.PORT || 4000;
import logger from './utils/log/logger';

import connect from './db/mongoConnection';
//@ts-ignore
import mongoURI from './db/config';

//@ts-ignore
import saveBotDiscordMessages from './gqlModules/shared/dataSources/utils/dbMethods/saveBotMessage';
//@ts-ignore
import saveTradeDiscordMessages from './gqlModules/shared/dataSources/utils/dbMethods/saveTradeMessage';

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
app.use(morgan('dev'));

const db: any = mongoURI;
connect(db);

setInterval(() => {
	saveTradeDiscordMessages('694323672483364874', 50);
	saveBotDiscordMessages('745816529131536414', 50);
}, 10000);

app.listen(port, () => {
	if (process.env.NODE_ENV === 'development') {
		logger.info(`🚀Development Server is ready at http://localhost:${port}${server.graphqlPath}`);
	}
	else {
		logger.info(`🚀Production Server is ready at http://localhost:${port}${server.graphqlPath}`);
	}
});
