import { RESTDataSource } from 'apollo-datasource-rest';
import axios from 'axios';
import { parseMessage, parseTrade } from './utils/messageParser';
import { DiscordMessage } from './utils/types';
import TradeMessage from '../../../db/models/chatMessage';
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

//@ts-ignore

export class DiscordAPI extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = 'https://discord.com/api';
	}

	willSendRequest(request: any) {
		request.headers.set('Authorization', process.env.DISCORD_AUTH_TOKEN);
	}

	async saveDiscordChatMessages(channelID: number, numMessages: number) {
		try {
			const chatMessages: any = await this.get(`/channels/${channelID}/messages?limit=${numMessages}`);
			console.log('Chat Messages', chatMessages);

			const newChatMessage = new TradeMessage({
				tradeMessageID: chatMessages[0].id,
				content: chatMessages[0].content,
				author: {
					username: chatMessages[0].author.username
				},
				timeStamp: chatMessages[0].timestamp
			});

			console.log('chat message Date', newChatMessage.timestamp);

			const saveChatMessage = await newChatMessage.save();
			return saveChatMessage;
		} catch (error) {
			console.log('Save Discord Chat Message:', error);
		}

		return;
	}

	async getDiscordMessages(channelID: number, numMessages: number) {
		const messages = await this.get(`/channels/${channelID}/messages?limit=${numMessages}`);
		const messagesFromDB = messageDB[channelID];

		if (messagesFromDB) {
			return messagesFromDB.splice(0, numMessages).map(parseMessage);
		}
		const parsedMessage = messages.map(parseMessage);
		return parsedMessage;
	}
	async saveDiscordBotMessage(channelID: number, numMessages: number) {
		const botMessages = await this.get(`/channels/${channelID}/messages?limit=${numMessages}`);
		const newBotMessage = new BotMessage({
			botMessageID: botMessages[0].id,
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
		if (newBotMessage.botMessageID === botMessages[0].chatMessageID) {
			const dbError = 'Message already exists in the DB';
			return dbError;
		}
		else {
			const saveBotMessage = await newBotMessage.save();
			return saveBotMessage;
		}
	}

	async getDiscordMessageOrders(channelID: number, numMessages: number) {
		const messages = await this.getDiscordMessages(channelID, numMessages);
		return messages.map(parseTrade);
	}
}
