import { RESTDataSource } from 'apollo-datasource-rest';

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
    return await this.get(
      `/channels/${channelID}/messages?limit=${numMessages}`
    );
  }
}