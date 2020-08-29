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
  optionTypeDefs
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
  optionResolvers
);

export const dataSources = () => {
  return {
    alphaVantageAPI: new AlphaVantageAPI(),
    discordAPI: new DiscordAPI(),
    robinhoodAPI: new RobinhoodAPI()
  };
};
