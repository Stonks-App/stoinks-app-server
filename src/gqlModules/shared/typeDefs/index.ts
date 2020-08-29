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
        stockSymbol: [String],
        type: String,
        strikePrice: String,
        expirationDate: String,
        target: [String]
    }
`;

export const sharedTypeDefs = [
  defaultTypeDefs,
  ...scalerTypeDefs,
  tradeTypeDefs
];
