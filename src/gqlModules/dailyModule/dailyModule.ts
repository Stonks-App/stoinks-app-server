export const typeDefs = `
    extend type Query {
        dailyData(stockSymbol: String): [DailyQuote]
    }
    type DailyQuote {
        symbol: String,
        date: Date,
        price: Price
    }
    type Price {
        high: USCurrency,
        low: USCurrency,
        open: USCurrency,
        close: USCurrency,
        volume: PositiveInt
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
