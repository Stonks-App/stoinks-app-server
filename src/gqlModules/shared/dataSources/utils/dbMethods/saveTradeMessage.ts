import axios from 'axios';
import TradeMessage from '../../../../../db/models/tradeMessage';

const saveTradeDiscordMessages = async (channelID: string, numMessages: number) => {
	const discordAxios = axios.create({
		baseURL: 'https://discord.com/api',
		timeout: 1000,
		headers: { Authorization: process.env.DISCORD_AUTH_TOKEN }
	});
	//@ts-ignore
	const tradeMessages: any = await discordAxios
		.get(`/channels/${channelID}/messages?limit=${numMessages}`)
		.then(async (res) => {
			const data = res.data;

			data.forEach(async (message: any) => {
				//get the current message id and check the DB to see if its there.

				const dbMessage = await TradeMessage.findOne({ tradeMessageID: message.id });
				if (dbMessage) {
					console.log('Only new TRADE messages were saved');
				}
				else {
					const newChatMessage = new TradeMessage({
						tradeMessageID: message.id,
						channel_id: message.channel_id,
						content: message.content,
						author: {
							authorId: message.author.id,
							username: message.author.username
						},
						timeStamp: message.timestamp
					});
					const savedMessage = newChatMessage.save();
					return savedMessage;
				}
				return;
			});
		})
		.catch((error) => {
			return console.log('Foreach error', error);
		});
};

export default saveTradeDiscordMessages;
