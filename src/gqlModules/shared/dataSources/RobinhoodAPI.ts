import { RESTDataSource } from 'apollo-datasource-rest';
// @ts-ignore
import { Robinhood } from 'algotrader';
const User = Robinhood.User;
const Instrument = Robinhood.Instrument;
const OptionInstrument = Robinhood.OptionInstrument;
const OptionOrder = Robinhood.OptionOrder;

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
	async getOptionData(stockSymbol: string, expirationDate: string, strikePrice: string, type: string) {
		/*
		1. Create the user
		2. Get Primary Instrument
		3. Option Chain - Comparing with ExpirationDate and Strike Price
			a. Get optionPremium - OptionOrder.getPreimum()=> number
			b. Get Greeks - 
			c. Get Volume
		6. Combine and return output
		*/
		try {
			const user = await this.getUser();

			//2. Get query expiration into proper format.
			const queryExp = moment(expirationDate).format('YYYY-MM-DD');

			//3. Set the primary instument with the input stockSymbol
			const stock = await Instrument.getBySymbol(stockSymbol);

			//4. Get option chain
			const chain = await OptionInstrument.getChain(user, stock, type).then((optionChain: any) => {
				optionChain.find((option: any) => {
					//get APIEXP into proper format.
					const apiExp = moment(option.dates.expiration).format('YYYY-MM-DD');
					if (strikePrice == option.strikePrice && queryExp == apiExp) {
						console.log('option', option);
						return option;
					}

					//5. Get Premium for the option
					const optionOrder = new OptionOrder(user, {
						side: 'buy',
						type: 'limit', // Note: Robinhood does not allow market buy orders
						price: 200,
						timeInForce: 'gtc',
						quantity: 1,
						option: option
					});
					const optionPreimum = optionOrder.getPreimum();
					console.log(optionPreimum);
				});
			});

			console.log('chain', chain);

			return chain;
		} catch (error) {
			console.log(error);
		}
	}
}
