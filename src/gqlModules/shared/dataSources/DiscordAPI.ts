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

	//const nexsus-swing-channel = 694323672483364874
	async getDiscordMessages(channelID: number, numMessages: number) {
		const messagesFromDB = messageDB[channelID];
		if (messagesFromDB) {
			console.log('FETCHED FROM CACHE');
			return messagesFromDB.splice(0, numMessages).map(parseMessage);
		}
		console.log('NOT FETCHED FROM CACHE');
		const messages = await this.get(`/channels/${channelID}/messages?limit=${numMessages}`);
		return messages.map(parseMessage);
	}

	async getDiscordMessageOrders(channelID: number, numMessages: number) {
		const messages = await this.getDiscordMessages(channelID, numMessages);
		return messages.map(parseTrade);
	}
}
