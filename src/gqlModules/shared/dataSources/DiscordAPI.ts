import { RESTDataSource } from 'apollo-datasource-rest';
import axios from 'axios';
import { parseMessage, parseTrade } from './utils/messageParser';
import { DiscordMessage } from './utils/types';

interface MessageDBInterface {
	[key: string]: [DiscordMessage];
}

const messageDB: MessageDBInterface = {};

const discordAxios = axios.create({
	baseURL: 'https://discord.com/api',
	timeout: 1000,
	headers: { Authorization: process.env.DISCORD_AUTH_TOKEN }
});

export const discordMessagePull = (channelID: string) => {
	discordAxios
		.get<[DiscordMessage]>(`/channels/${channelID}/messages?limit=100`)
		.then(({ data }: { data: [DiscordMessage] }) => {
			messageDB[channelID] = data;
		});
};

export class DiscordAPI extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = 'https://discord.com/api';
	}

	willSendRequest(request: any) {
		request.headers.set('Authorization', process.env.DISCORD_AUTH_TOKEN);
	}

	async getTradeDiscordMessages(channelID: number, numMessages: number) {
		const messages = await this.get(`/channels/${channelID}/messages?limit=${numMessages}`);
		const messagesFromDB = messageDB[channelID];

		if (messagesFromDB) {
			return messagesFromDB.splice(0, numMessages).map(parseMessage);
		}
		const parsedMessage = messages.map(parseMessage);
		return parsedMessage;
	}

	// async getBotDiscordMessages(channelID: number, numMessages: number) {}

	async getDiscordMessageOrders(channelID: number, numMessages: number) {
		const messages = await this.getTradeDiscordMessages(channelID, numMessages);
		return messages.map(parseTrade);
	}
}
