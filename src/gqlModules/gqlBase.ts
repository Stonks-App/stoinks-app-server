import { defaultTypeDefs } from './shared/defaults/defaultTypeDefs';
import {
  typeDefs as exampleTypeDefs,
  resolvers as exampleResolvers
} from './exampleModule/exampleModule';
import {
  typeDefs as dailyTypeDefs,
  resolvers as dailyResolvers
} from './dailyModule/dailyModule';
import {
  typeDefs as discordTypeDefs,
  resolvers as discordResolvers
} from './discordModule/discordModule';
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
  baseTypeDef,
  defaultTypeDefs,
  exampleTypeDefs,
  dailyTypeDefs,
  discordTypeDefs
];

const baseResolver = {
  Query: {}
};

export const resolvers = {
  ...baseResolver,
  ...exampleResolvers,
  ...dailyResolvers,
  ...discordResolvers
};

export const dataSources = () => {
  return {
    alphaVantageAPI: new AlphaVantageAPI(),
    discordAPI: new DiscordAPI(),
    robinhoodAPI: new RobinhoodAPI()
  };
};
