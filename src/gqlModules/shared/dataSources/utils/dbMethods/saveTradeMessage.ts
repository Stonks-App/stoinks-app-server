import axios from 'axios';
import TradeMessage from '../../../../../db/models/tradeMessage';

const saveTradeDiscordMessages = async (channelID: number, numMessages: number) => {
	try {
		const discordAxios = axios.create({
			baseURL: 'https://discord.com/api',
			headers: { Authorization: process.env.DISCORD_AUTH_TOKEN }
		});

		const tradeMessages: any = await discordAxios
			.get(`/channels/${channelID}/messages?limit=${numMessages}`)
			.then((res) => {
				console.log('trade Message', res);
				console.log('trade Message Data', res.data);
			})
			.catch((err) => {
				console.log(err);
			});

		const newChatMessage = new TradeMessage({
			tradeMessageID: tradeMessages[0].data.id,
			channel_id: tradeMessages[0].data.channel_id,
			content: tradeMessages[0].data.content,
			author: {
				authorId: tradeMessages[0].data.author.id,
				username: tradeMessages[0].data.author.username
			},
			timeStamp: tradeMessages[0].data.timestamp
		});

		const saveChatMessage = await newChatMessage.save();
		return saveChatMessage;
	} catch (error) {
		return console.log('Save Discord Chat Message Error');
	}
};

export default saveTradeDiscordMessages;
