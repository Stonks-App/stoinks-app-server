export const typeDefs = `
    extend type Query {
        getDiscordMessages(channelID: String, numMessages: Float): [DiscordMessage]
    }
    type DiscordMessage {
        id: String,
        content: String,
        author: Author,
        timestamp: String
    }

    type Author {
        username: String
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
