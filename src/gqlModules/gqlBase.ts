import merge from 'lodash.merge';

import { sharedTypeDefs } from './shared/typeDefs';
import { sharedResolvers } from './shared/resolvers';
// import {
//   typeDefs as exampleTypeDefs,
//   resolvers as exampleResolvers
// } from './exampleModule/exampleModule';
import {
  typeDefs as dailyTypeDefs,
  resolvers as dailyResolvers
} from './dailyModule/dailyModule';
import {
  typeDefs as discordTypeDefs,
  resolvers as discordResolvers
} from './discordModule/discordModule';
import {
  typeDefs as optionTypeDefs,
  resolvers as optionResolvers
} from './optionsModule/optionsModule';
<<<<<<< HEAD
=======
import {
  typeDefs as tradeTypeDefs,
  resolvers as tradeResolvers
} from './tradeModule/tradeModule';
>>>>>>> f7b572926d8b49cc896e02dc488828c62db41c89
import { AlphaVantageAPI } from './shared/dataSources/AlphaVantageAPI';
import { DiscordAPI } from './shared/dataSources/DiscordAPI';
import { RobinhoodAPI } from './shared/dataSources/RobinhoodAPI';

const baseTypeDef = `
    type Query {
        _empty: String
    }
    type Mutation {
        _empty: String
    }
`;

export const typeDefs = [
  //   exampleTypeDefs,
  baseTypeDef,
  ...sharedTypeDefs,
  dailyTypeDefs,
  discordTypeDefs,
<<<<<<< HEAD
  optionTypeDefs
=======
  optionTypeDefs,
  tradeTypeDefs
>>>>>>> f7b572926d8b49cc896e02dc488828c62db41c89
];

const baseResolver = {
  Query: {}
};

export const resolvers = merge(
  //   exampleResolvers,
  baseResolver,
  sharedResolvers,
  dailyResolvers,
  discordResolvers,
<<<<<<< HEAD
  optionResolvers
=======
  optionResolvers,
  tradeResolvers
>>>>>>> f7b572926d8b49cc896e02dc488828c62db41c89
);

export const dataSources = () => {
  return {
    alphaVantageAPI: new AlphaVantageAPI(),
    discordAPI: new DiscordAPI(),
    robinhoodAPI: new RobinhoodAPI()
  };
};
