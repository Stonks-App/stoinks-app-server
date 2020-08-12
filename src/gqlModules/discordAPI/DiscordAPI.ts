import { RESTDataSource } from 'apollo-datasource-rest';

export class DiscordAPI extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = 'https://discord.com/api';
	}

	willSendRequest(request: any) {
		request.headers.set('Authorization', 'NzI2ODgzMjIxODI4MDEwMDg0.XxHmVQ.o4iod2dJ-eNyXi9nsm8yoHERS48');
	}
	//const nexsus-swing-channel = 694323672483364874
	async getDiscordMessages(channelID: number, numMessages: number) {
		const data = await this.get(`/channels/${channelID}/messages?limit=${numMessages}`);
		//@ts-ignore
		console.log(data);
		//@ts-ignore

		return data;
	}
}
