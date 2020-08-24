import { RESTDataSource } from 'apollo-datasource-rest';
// @ts-ignore
import { Robinhood } from 'algotrader';
const User = Robinhood.User;
const Instrument = Robinhood.Instrument;
const OptionInstrument = Robinhood.OptionInstrument;

import moment from 'moment';

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

	//@ts-ignore
	async getOptionData(stockSymbol: string, expirationDate: string, strikePrice: number, type: string) {
		const user = await this.getUser();
		//@ts-ignore
		const queryExp = moment(expirationDate).format('YYYY-MM-DD');
		const stock = await Instrument.getBySymbol(stockSymbol);
		await OptionInstrument.getChain(user, stock, type).then((optionChain: any) => {
			const filteredOptions = optionChain.filter((option: any) => {
				const stringAPIExp = JSON.stringify(option.dates.expiration);
				const splitAPIExp = stringAPIExp.split('T');
				const apiExp = moment(splitAPIExp[0]).format('YYYY-MM-DD');
				if (option.strikePrice === strikePrice && apiExp === queryExp) {
					return option;
				}
			});
			filteredOptions.forEach(async (option: any) => {
				const optionPremiumInfo = await OptionInstrument.getPrices(user, [ option ]);
				return optionPremiumInfo;
			});
		});
	}
}
