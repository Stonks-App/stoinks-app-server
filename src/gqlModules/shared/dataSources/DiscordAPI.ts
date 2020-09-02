import { RESTDataSource } from 'apollo-datasource-rest';
import { parseMessage, parseTrade } from './utils/messageParser';

export class DiscordAPI extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = 'https://discord.com/api';
	}

	willSendRequest(request: any) {
		request.headers.set('Authorization', process.env.DISCORD_AUTH_TOKEN);
	}

	async getDiscordMessages(channelID: number, numMessages: number) {
		const messages = await this.get(`/channels/${channelID}/messages?limit=${numMessages}`);
		return messages.map(parseMessage);
	}

	async getDiscordMessageOrders(channelID: number, numMessages: number) {
		const messages = await this.getDiscordMessages(channelID, numMessages);
		return messages.map(parseTrade);
	}
}
