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
	async getOptionData(stockSymbol: string, expirationDate: string, strikPrice: string, type: string) {
		const user = await this.getUser();
		//@ts-ignore
		const inputExpiration = moment(expirationDate).format('yyyy-mm-dd');
		console.log('Input EXP', inputExpiration);

		const stock = await Instrument.getBySymbol(stockSymbol);
		//@ts-ignore
		const expiration = await OptionInstrument.getExpirations(user, stock)
			.then((res: any) => {
				const mainDate = res.forEach((expirationDate: any) => {
					const date = expirationDate.toString().split(' ');
					const pureDate = date[1] + ' ' + date[2] + ' ' + date[3];
					console.log('Robin EXP', pureDate);
				});
				console.log('FROM EXPIRATION', mainDate);
				return mainDate;
			})
			.catch((e: any) => {
				console.log(e);
			});
		// get option chain
		//@ts-ignore
		const optionObject = {
			tradability: 'tradable',
			strikePrice: strikPrice,
			state: 'active',
			type: type,
			symbol: stockSymbol
		};

		// const option = await new OptionInstrument(optionObject);
		// // console.log(option);

		// const optionChain = await OptionInstrument.getChain(user, stock, type);

		//@ts-ignore
		const robinExpiration = moment('SEP 16 2020').format();
		console.log('Moment Format of Robin Date', robinExpiration);

		/*
		1. Create the user 
		2. get the instrument 
		3. Option Chain 
		4. Optioninstrument. getprice, get exp 
		5. compare that to the incoming 
		6. return output 

		*/

		return null;
	}
}
