export const typeDefs = `
    extend type Query {
        dailyData(stockSymbol: String): [DailyQuote]
    }
    type DailyQuote {
        symbol: String,
        date: String,
        price: Price
    }
    type Price {
        high: String,
        low: String,
        open: String,
        close: String,
        volume: String
    }
`;

export const resolvers = {
	Query: {
		// @ts-ignore
		dailyData: async (
			_source: any,
			{ stockSymbol }: { stockSymbol: String },
			//@ts-ignore
			{ dataSources: { alphaVantageAPI } }
		) => {
			return await alphaVantageAPI.getDailyTimeSeries(stockSymbol);
		}
	}
};
