export const typeDefs = `
extend type Query {
  optionInstrument(stockSymbol: String, expirationDate: String, strikePrice: String, type: String): OptionInstrument
}
type OptionInstrument {
  meta: OptionMeta,
  price: OptionPrice,
  interest: OptionInterest
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
  volatility: String
}
type OptionInterest {
  openInterest: Int,
  highFillBuyPrice: String,
  highFillSellPrice: String,
  lowFillBuyPrice: String,
  lowFillSellPrice: String
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
			}: { stockSymbol: string; expirationDate: string; strikePrice: string; type: string },
			//@ts-ignore
			{ dataSources: { robinhoodAPI } }
		) => {
			let data = await robinhoodAPI.getOptionData(stockSymbol, expirationDate, strikePrice, type);
			data = data[0];
			const option = {
				meta: {
					stockSymbol: data.stockSymbol,
					expirationDate: data.dates.expiration,
					strikePrice: data.strikePrice,
					robinHoodUrl: data.instrumentURL
				},
				price: {
					ask: data.price.ask_price,
					bid: data.price.bid_price,
					mark: data.price.adjusted_mark_price
				},
				interest: {
					openInterest: data.price.open_interest,
					highFillBuyPrice: data.price.high_fill_rate_buy_price,
					highFillSellPrice: data.price.high_fill_rate_sell_price,
					lowFillBuyPrice: data.price.low_fill_rate_buy_price,
					lowFillSellPrice: data.price.low_fill_rate_sell_price
				}
			};
			return option;
		}
	}
};
