export const typeDefs = `
    extend type Query {
		discordMessages(channelID: String, numMessages: PositiveInt = 20, parseOrders: Boolean = false): [DiscordMessage]
		saveDiscordMessages(channelID: String, numMessages: PositiveInt = 20, parseOrders: Boolean = false): [ChatDiscordMessage]
    }
    type DiscordMessage {
        id: String,
        content: String,
        author: Author,
        timestamp: DateTime
	}

	type ChatDiscordMessage{
		chatMessageID: String,
		content: String,
		author: Author,
		timestamp: DateTime
	}
	
    type Author {
        username: String
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
				return await discordAPI.getDiscordMessageOrders(channelID, numMessages);
			}
			return discordAPI.getDiscordMessages(channelID, numMessages);
		},
		saveDiscordMessages: async (
			_source: any,
			{ channelID, numMessages }: { channelID: number; numMessages: number; parseOrders: boolean },
			//@ts-ignore
			{ dataSources: { discordAPI } }
		) => {
			const data = await discordAPI.saveDiscordChatMessages(channelID, numMessages);
			console.log('data from Resolver', data);
			return data;
		}
	}
};
