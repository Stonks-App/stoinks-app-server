import { parseMessage } from './utils/messageParser';

export const typeDefs = `
    extend type Query {
        discordMessages(channelID: String, numMessages: PositiveInt = 20, parseOrders: Boolean = false): [DiscordMessage]
    }
    type DiscordMessage {
        id: String,
        content: String,
        author: Author,
        timestamp: DateTime,
        order: OptionTrade
    }
    type Author {
        username: String
    }
`;

export const resolvers = {
  Query: {
    discordMessages: async (
      _source: any,
      {
        channelID,
        numMessages,
        parseOrders
      }: { channelID: number; numMessages: number; parseOrders: boolean },
      //@ts-ignore
      { dataSources: { discordAPI } }
    ) => {
      const data = await discordAPI.getDiscordMessages(channelID, numMessages);
      return parseOrders ? data.map(parseMessage) : data;
    }
  }
};
