export const typeDefs = `
    extend type Query {
        discordMessages(channelID: String, numMessages: PositiveInt = 20, parseOrders: Boolean = false): [DiscordMessage]
    }
    type DiscordMessage {
        id: String,
        content: String,
        author: Author,
        timestamp: DateTime,
        order: OptionTrade,
        embeds: [Embed]
    }
    type Author {
        username: String
    }

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
};
