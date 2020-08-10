import {defaultTypeDefs} from './defaults/defaultTypeDefs';
import {typeDefs as exampleTypeDefs, resolvers as exampleResolvers} from './exampleModule/exampleModule';
import {typeDefs as dailyTypeDefs, resolvers as dailyResolvers} from './dailyModule/dailyModule';
import { AlphaVantageAPI } from './dataSources/AlphaVantageAPI';

const baseTypeDef = `
    type Query {
        _empty: String
    }
    type Mutation {
        _empty: String
    }
`

export const typeDefs = [
    baseTypeDef,
    defaultTypeDefs,
    exampleTypeDefs,
    dailyTypeDefs
]

const baseResolver = {
    Query: {
	}
}

export const resolvers = {
    ...baseResolver,
    ...exampleResolvers,
    ...dailyResolvers
};

export const dataSources = () => {
    return {
        alphaVantageAPI: new AlphaVantageAPI()
    }
};