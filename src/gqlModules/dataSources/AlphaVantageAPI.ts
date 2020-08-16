import { RESTDataSource } from 'apollo-datasource-rest';
// @ts-ignore
import { Data } from 'algotrader';
import DataLoader from 'dataloader';

export class AlphaVantageAPI extends RESTDataSource {
	private api: any;

	constructor() {
		super();
		const AlphaVantage = Data.AlphaVantage;
		this.api = new AlphaVantage('I73R9VKBL7Z5J4KM');
	}
	//@ts-ignore
	private dailyTimeSeriesLoader = new DataLoader(async (stockSymbols: string[]) => {
		const data = stockSymbols.map(async (symbol) => {
			return await this.api.timeSeriesDaily(symbol, true, true);
		});
		console.log(data);

		return data;
	});

	async getDailyTimeSeries(stockSymbol: string) {
		return this.dailyTimeSeriesLoader.load(stockSymbol);
	}
}
