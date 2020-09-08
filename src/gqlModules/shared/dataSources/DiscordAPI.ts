import { RESTDataSource } from 'apollo-datasource-rest';
import axios from 'axios';
import { parseMessage, parseTrade } from './utils/messageParser';
import { DiscordMessage } from './utils/types';
import TradeMessage from '../../../db/models/tradeMessage';
import BotMessage from '../../../db/models/botMessages';

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

	async saveTradeDiscordMessages(channelID: number, numMessages: number) {
		try {
			const tradeMessages: any = await this.get(`/channels/${channelID}/messages?limit=${numMessages}`);
			console.log('Chat Messages', tradeMessages);

			const newChatMessage = new TradeMessage({
				tradeMessageID: tradeMessages[0].id,
				channel_id: tradeMessages[0].channel_id,
				content: tradeMessages[0].content,
				author: {
					authorId: tradeMessages[0].author.id,
					username: tradeMessages[0].author.username
				},
				timeStamp: tradeMessages[0].timestamp
			});

			console.log('chat message Date', newChatMessage.timestamp);

			const saveChatMessage = await newChatMessage.save();
			return saveChatMessage;
		} catch (error) {
			console.log('Save Discord Chat Message:', error);
		}

		return;
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

	async saveBotDiscordMessage(channelID: number, numMessages: number) {
		try {
			const botMessages: any = await this.get(`/channels/${channelID}/messages?limit=${numMessages}`);
			console.log('Chat Messages', botMessages);

			const newBotMessage = new BotMessage({
				tradeMessageID: botMessages[0].id,
				channel_id: botMessages[0].channel_id,
				embeds: {
					typeOfData: botMessages[0].embeds[0].type,
					title: botMessages[0].embeds[0].title,
					color: botMessages[0].embeds[0].color,
					fields: {
						time: botMessages[0].embeds[0].fields[0].value,
						ticker: botMessages[0].embeds[0].fields[1].value,
						expirationDate: botMessages[0].embeds[0].fields[2].value,
						callOrPut: botMessages[0].embeds[0].fields[3].value,
						spotPrice: botMessages[0].embeds[0].fields[4].value,
						strikePrice: botMessages[0].embeds[0].fields[5].value,
						flowSize: botMessages[0].embeds[0].fields[6].value,
						typeOfOptionOrder: botMessages[0].embeds[0].fields[7].value,
						premium: botMessages[0].embeds[0].fields[8].value
					}
				},
				timeStamp: botMessages[0].timestamp
			});

			console.log('chat message Date', newBotMessage.timeStamp);

			const saveChatMessage = await newBotMessage.save();
			return saveChatMessage;
		} catch (error) {
			console.log('Save Discord Chat Message:', error);
		}
		return;
	}

	// async getBotDiscordMessages(channelID: number, numMessages: number) {}

	async getDiscordMessageOrders(channelID: number, numMessages: number) {
		const messages = await this.getTradeDiscordMessages(channelID, numMessages);
		return messages.map(parseTrade);
	}
}
