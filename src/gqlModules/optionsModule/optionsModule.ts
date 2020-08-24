export const typeDefs = `
extend type Query {
  optionInstrument(stockSymbol: String, expirationDate: String, strikePrice: Int, type: String): OptionInstrument
}
type OptionInstrument {
  meta: OptionMeta,
  price: OptionPrice,
  volume: OptionVolume,
  interest: OptionInterest,
  greeks: Greeks
}
type OptionMeta {
  stockSymbol: String,
  expirationDate: String,
  strikePrice: Int,
  robinHoodUrl: String
}
type OptionPrice {
  ask: String,
  bid: String,
  mark: String,
  volatility: String,
}
type OptionVolume {
  askSize: String,
  bidSize: String,
  optionVolume: String
}
type OptionInterest {
  openInterest: Int,
  highFillBuyPrice: String,
  highFillSellPrice: String
}
type Greeks {
  delta: String,
  gamma: String,
  theta: String,
  vega: String,
  IV:String
}
`;

export const resolvers = {
	Query: {
		optionInstrument: async (
			_source: any,
			{
				stockSymbol,
				expirationDate,
				strikePrice,
				type
			}: { stockSymbol: string; expirationDate: string; strikePrice: number; type: string },
			//@ts-ignore
			{ dataSources: { robinhoodAPI } }
		) => {
			// get option data for given inputs
			//@ts-ignore
			const data = await robinhoodAPI.getOptionData(stockSymbol, expirationDate, strikePrice, type);
			console.log('data in option Module', data);
			console.log('data in option Module', typeof data);
			const option = {
				optionInstrument: {
					meta: {
						stockSymbol: data.stockSymbol,
						expirationDate: data.dates.expiration,
						strikePrice: data.strikePrice,
						robinhoodUrl: data.instrumentURL
					},
					price: {
						ask: data.price.ask_price,
						bid: data.price.bid_price,
						mark: data.price.adjusted_mark_price
					},
					volume: {
						askSize: data.price.ask_size,
						bidSize: data.price.bid_size,
						optionVolume: data.price.volume
					},
					interest: {
						openInterest: data.price.open_interest,
						highFillBuyPrice: data.price.high_fill_rate_buy_price,
						highFillSellPrice: data.price.high_fill_rate_sell_price
					},
					greeks: {
						delta: data.price.delta,
						gamma: data.price.gamma,
						theta: data.price.theta,
						vega: data.price.vega,
						IV: data.price.implied_volatility
					}
				}
			};

			return option;
		}
	}
};
