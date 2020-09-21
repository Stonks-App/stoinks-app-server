import axios from 'axios';
import BotMessage from '../../../../../db/models/botMessages';

const discordAxios = axios.create({
	baseURL: 'https://discord.com/api',
	timeout: 1000,
	headers: { Authorization: process.env.DISCORD_AUTH_TOKEN }
});

const saveBotDiscordMessage = async (channelID: number, numMessages: number) => {
	try {
		const botMessages: any = await discordAxios.get(`/channels/${channelID}/messages?limit=${numMessages}`);

		const newBotMessage = new BotMessage({
			botMessageID: botMessages[0].id,
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
		const saveChatMessage = await newBotMessage.save();
		return saveChatMessage;
	} catch (error) {
		return console.log('Save Discord Chat Message:', error);
	}
};

export default saveBotDiscordMessage;
