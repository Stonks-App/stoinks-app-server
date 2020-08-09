import {defaultTypeDefs} from './defaults/defaultTypeDefs'
import {typeDefs as exampleTypeDefs, resolvers as exampleResolvers} from './exampleModule/exampleModule'

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
    exampleTypeDefs
]

const baseResolver = {
    Query: {
	}
}

export const resolvers = {
    ...baseResolver,
    ...exampleResolvers
};