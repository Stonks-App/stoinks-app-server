export const typeDefs = `
    extend type Query {
        getDiscordMessages(channelID: String, numMessages: Float): [DiscordMessage]
    }
    type DiscordMessage {
        id: String,
        content: String,
        author: Author,
        timestamp: String,
        order: OptionOrder
    }
    type Author {
        username: String
    }
    type OptionOrder {
        operation: String,
        stockSymbol: [String],
        type: String,
        strikePrice: Int,
        expirationDate: String,
        target: [String]
    }
`;

export const resolvers = {
  Query: {
    getDiscordMessages: async (
      _source: any,
      { channelID, numMessages }: { channelID: number; numMessages: number },
      //@ts-ignore
      { dataSources: { discordAPI } }
    ) => {
      return await discordAPI.getDiscordMessages(channelID, numMessages);
    }
  }
};
