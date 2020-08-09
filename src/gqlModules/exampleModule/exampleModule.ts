export const typeDefs = `
  extend type Query{
    exampleModule: MessageType
  }
  type MessageType {
    message: String
  }
  type exampleMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }
  extend type Mutation {
    exampleMutation(text:String!): exampleMutationResponse
  }
`;

export const resolvers = {
  Query: {
    exampleModule: () => {
      return {message: 'hello world'}
    }
  },
  Mutation:{
    exampleMutation: (_: any, {text} : {text: string}) => {
      return {
        code: '200',
        success: true,
        message: `hello ${text}`
      }
    }
  }
};