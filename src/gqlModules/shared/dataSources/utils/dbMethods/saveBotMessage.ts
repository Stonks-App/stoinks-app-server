import axios from 'axios';
import BotMessage from '../../../../../db/models/botMessages';

const saveBotDiscordMessages = async (channelID: string, numMessages: number) => {
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
			console.log('DATA', data);
			data.forEach(async (message: any) => {
				//get the current message id and check the DB to see if its there.
				console.log('E', message);
				const dbMessage = await BotMessage.findOne({ botMessageID: message.id });
				if (dbMessage) {
					console.log('Only new BOT messages were saved');
				}
				else {
					const newBotMessage = new BotMessage({
						botMessageID: message.id,
						channel_id: message.channel_id,
						embeds: {
							typeOfData: message.embeds[0].type,
							title: message.embeds[0].title,
							color: message.embeds[0].color,
							fields: {
								time: message.embeds[0].fields[0].value,
								ticker: message.embeds[0].fields[1].value,
								expirationDate: message.embeds[0].fields[2].value,
								callOrPut: message.embeds[0].fields[3].value,
								spotPrice: message.embeds[0].fields[4].value,
								strikePrice: message.embeds[0].fields[5].value,
								flowSize: message.embeds[0].fields[6].value,
								typeOfOptionOrder: message.embeds[0].fields[7].value,
								premium: message.embeds[0].fields[8].value
							}
						},
						timeStamp: message.timestamp
					});
					const savedMessage = newBotMessage.save();
					return savedMessage;
				}
				return;
			});
		})
		.catch((error) => {
			return console.log('Foreach error', error);
		});
};

export default saveBotDiscordMessages;
