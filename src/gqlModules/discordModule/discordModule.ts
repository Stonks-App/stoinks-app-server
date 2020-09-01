export const typeDefs = `
    extend type Query {
        discordMessages(channelID: String, numMessages: PositiveInt = 20, parseOrders: Boolean = false): [DiscordMessage]
    }
    type DiscordMessage {
        id: String,
        content: String,
        author: Author,
        timestamp: DateTime,
<<<<<<< HEAD
        order: OptionTrade,
        embeds: [Embed]
=======
        order: OptionTrade
>>>>>>> f7b572926d8b49cc896e02dc488828c62db41c89
    }
    type Author {
        username: String
    }
<<<<<<< HEAD

    type Embed {
        type: String,
        title: String, 
        fields: [Field]
    }

    type Field {
        name: String,
        value: String
    }
    
`;

export const resolvers = {
	Query: {
		discordMessages: async (
			_source: any,
			{ channelID, numMessages, parseOrders }: { channelID: number; numMessages: number; parseOrders: boolean },
			//@ts-ignore
			{ dataSources: { discordAPI } }
		) => {
			if (parseOrders) {
				await discordAPI.getDiscordMessageOrders(channelID, numMessages);
			}

			const data = await discordAPI.getDiscordMessages(channelID, numMessages);
			console.log('Data', data);

			return data;
		}
	}
=======
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
      if (parseOrders) {
        return await discordAPI.getDiscordMessageOrders(channelID, numMessages);
      }
      return discordAPI.getDiscordMessages(channelID, numMessages);
    }
  }
>>>>>>> f7b572926d8b49cc896e02dc488828c62db41c89
};
