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
        high: PositiveFloat,
        low: PositiveFloat,
        open: PositiveFloat,
        close: PositiveFloat,
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
