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
<<<<<<< HEAD
        strikePrice: PositiveFloat,
=======
        strikePrice: String,
>>>>>>> f7b572926d8b49cc896e02dc488828c62db41c89
        expirationDate: String,
        target: [String]
    }

    type Ticker {
        exchange: String,
        symbol: String
    }
`;

<<<<<<< HEAD
export const sharedTypeDefs = [ defaultTypeDefs, ...scalerTypeDefs, tradeTypeDefs ];
=======
export const sharedTypeDefs = [
  defaultTypeDefs,
  ...scalerTypeDefs,
  tradeTypeDefs
];
>>>>>>> f7b572926d8b49cc896e02dc488828c62db41c89
