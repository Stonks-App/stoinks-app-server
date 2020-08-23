import { RESTDataSource } from 'apollo-datasource-rest';
// @ts-ignore
import { Robinhood } from 'algotrader';
import { DiscordAPI } from '../../shared/dataSources/DiscordAPI';
import { parseMessage } from '../../discordModule/utils/messageParser';
import { OptionBuyOrder } from 'src/gqlModules/discordModule/types';
const User = Robinhood.User;
const Instrument = Robinhood.Instrument;
const OptionInstrument = Robinhood.OptionInstrument;

const options = {
	doNotSaveToDisk: true
};

let mainUser: any = null;

export class RobinhoodAPI extends RESTDataSource {
	constructor() {
		super();
	}

	private getUser() {
		const loadedUser = mainUser;
		if (loadedUser) {
			if (!loadedUser.isAuthenticated()) {
				loadedUser.reauthenticate();
			}
			return loadedUser;
		}
		else {
			console.log('Create new user');
			const user = new User(
				'stonks.go.brrr@gmail.com',
				'qLS&fUmIM3c&2*j^Qx3',
				'e0063428-35ad-4f61-974c-c181ba33482c',
				options
			);
			return this.authenticateUser(user);
		}
	}

	private authenticateUser(user: any) {
		return user
			.authenticate('qLS&fUmIM3c&2*j^Qx3')
			.then((authenticatedUser: any) => {
				console.log('RobinHood user authenticated');
				// authenticatedUser.save();
				mainUser = authenticatedUser;
				return authenticatedUser;
			})
			.catch((e: any) => {
				console.log(e);
				return null;
			});
	}

	// TODO: Remove me
	async getPortfolio() {
		const data = await this.getUser().getPortfolio();
		console.log(data);
		return data;
	}

	//@ts-ignore
	async getOptionData(stockSymbol: string, expirationDate: string, strikPrice: string) {
		const newMessage = await new DiscordAPI().getDiscordMessages(694323672483364874, 1);
		const messageData = parseMessage(newMessage[0]);
		const stock = await Instrument.getBySymbol(messageData.order?.stockSymbol);
		const user = this.getUser();
		if (messageData.order?.operation === 'BTO') {
			const order = messageData.order as OptionBuyOrder;
			const optionChain = await OptionInstrument.getChain(user, stock, order.type);
			console.log(optionChain)
		}


		return console.log('inside getOptionData');
	}
}
