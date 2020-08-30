import { typeDefs as scalerTypeDefs } from 'graphql-scalars';
// https://www.npmjs.com/package/graphql-scalars#the-types

const defaultTypeDefs = `
    interface MutationResponse {
        code: String!
        success: Boolean!
        message: String!
    }
`;

const tradeTypeDefs = `
    type OptionTrade {
        source: String
        operation: String,
        tickers: [Ticker],
        type: String,
        strikePrice: String,
        expirationDate: String,
        target: [String]
    }

    type Ticker {
        exchange: String,
        symbol: String
    }
`;

export const sharedTypeDefs = [
  defaultTypeDefs,
  ...scalerTypeDefs,
  tradeTypeDefs
];
