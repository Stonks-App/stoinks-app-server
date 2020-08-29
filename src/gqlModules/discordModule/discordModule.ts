import { parseMessage } from './utils/messageParser';

export const typeDefs = `
    extend type Query {
        getDiscordMessages(channelID: String, numMessages: Float, parseOrders: Boolean): [DiscordMessage]
    }
    type DiscordMessage {
        id: String,
        content: String,
        author: Author,
        timestamp: String,
        order: OptionTrade
    }
    type Author {
        username: String
    }
`;

export const resolvers = {
  Query: {
    getDiscordMessages: async (
      _source: any,
      {
        channelID,
        numMessages,
        parseOrders = false
      }: { channelID: number; numMessages: number; parseOrders: boolean },
      //@ts-ignore
      { dataSources: { discordAPI } }
    ) => {
      const data = await discordAPI.getDiscordMessages(channelID, numMessages);
      return parseOrders ? data.map(parseMessage) : data;
    }
  }
};
