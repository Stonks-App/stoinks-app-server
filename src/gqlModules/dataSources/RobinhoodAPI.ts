import { RESTDataSource } from 'apollo-datasource-rest';
const { User } = require('algotrader').Robinhood;

const options = {
	doNotSaveToDisk: false, // If the `save` method should not store the user login info to disk (file)
	serializedUserFile: null // File to where the serialized user login info can be saved
};
export class RobinhoodAPI extends RESTDataSource {
	// private user: any;

	constructor() {
		super();
		console.log('hitting this? ');
		const user = new User('stonks.go.brrr@gmail.com', options);
		console.log(user);
		user
			.authenticate()
			.then(() => {
				console.log('auth');
			})
			.catch((e: any) => {
				console.log(e);
			});
	}

	// isAuthenticate() {
	// 	this.user
	// 		.authenticate()
	// 		.then(() => {
	// 			console.log('authenticated');
	// 			this.getPortfolio();
	// 		})
	// 		.catch((error: any) => console.log(error));
	// }

	// async getPortfolio() {
	// 	const data = await this.user.getPortfolio();
	// 	console.log(data);
	// 	return data;
	// }
}
