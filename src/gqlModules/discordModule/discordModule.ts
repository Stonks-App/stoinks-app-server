export const typeDefs = `
    extend type Query {
		getTradeDiscordMessages(channelID: String, numMessages: PositiveInt = 20, parseOrders: Boolean = false): [DiscordMessage]
		getBotDiscordMessages(channelID: String, numMessages: PositiveInt = 20, parseOrders: Boolean = false): [BotDiscordMessage]
    }
    type DiscordMessage {
        id: String,
        content: String,
        author: Author,
        timestamp: DateTime
	}

	type BotDiscordMessage {
		botMessageID: String,
		embeds: Embeds,
		timestamp: DateTime
	}
	
    type Author {
        username: String
	}
	
	type Embeds {
		typeOfData: String,
		ticker: String,
		expirationDate: String,
		callOrPut: String,
		spotPrice: String, 
		strikePrice: String,
		flowSize: String,
		typeOfOptionOrder: String,
		premium: String
	}
`;

export const resolvers = {
	Query: {
		//Resolvers for chat discord messages
		getTradeDiscordMessages: async (
			_source: any,
			{ channelID, numMessages, parseOrders }: { channelID: number; numMessages: number; parseOrders: boolean },
			//@ts-ignore
			{ dataSources: { discordAPI } }
		) => {
			if (parseOrders) {
				return await discordAPI.getDiscordMessageOrders(channelID, numMessages);
			}
			return discordAPI.getTradeDiscordMessages(channelID, numMessages);
		}
		//bot discord messages
		// getBotDiscordMessages: async (
		// 	_source: any,
		// 	{ channelID, numMessages, parseOrders }: { channelID: number; numMessages: number; parseOrders: boolean },
		// 	//@ts-ignore
		// 	{ dataSources: { discordAPI } }
		// ) => {
		// 	if (parseOrders) {
		// 		return await discordAPI.getDiscordMessageOrders(channelID, numMessages);
		// 	}
		// 	return discordAPI.getChatDiscordMessages(channelID, numMessages);
		// },
	}
};
