import { RESTDataSource } from 'apollo-datasource-rest';
<<<<<<< HEAD
import { parseTrade } from './utils/messageParser';
=======
import { parseMessage, parseTrade } from './utils/messageParser';
>>>>>>> f7b572926d8b49cc896e02dc488828c62db41c89

export class DiscordAPI extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = 'https://discord.com/api';
	}

	willSendRequest(request: any) {
		request.headers.set('Authorization', process.env.DISCORD_AUTH_TOKEN);
	}

<<<<<<< HEAD
	//const nexsus-swing-channel = 694323672483364874
	async getDiscordMessages(channelID: number, numMessages: number) {
		const messages = await this.get(`/channels/${channelID}/messages?limit=${numMessages}`);
		return messages;
	}

	async getDiscordMessageOrders(channelID: number, numMessages: number) {
		const messages = await this.getDiscordMessages(channelID, numMessages);
		return messages.map(parseTrade);
	}
=======
  //const nexsus-swing-channel = 694323672483364874
  async getDiscordMessages(channelID: number, numMessages: number) {
    const messages = await this.get(
      `/channels/${channelID}/messages?limit=${numMessages}`
    );
    return messages.map(parseMessage);
  }

  async getDiscordMessageOrders(channelID: number, numMessages: number) {
    const messages = await this.getDiscordMessages(channelID, numMessages);
    return messages.map(parseTrade);
  }
>>>>>>> f7b572926d8b49cc896e02dc488828c62db41c89
}
