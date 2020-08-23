export const typeDefs = `
extend type Query {
  optionInstrument(stockSymbol: String, expirationDate: String, strikePrice: String): OptionInstrument
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
  strikePrice: String,
  robinHoodUrl: String
}
type OptionPrice {
  ask: String,
  bid: String,
  mark: String,
  volatility: String,
}
type OptionVolume {
  ask: String,
  bid: String,
  mark: String
}
type OptionInterest {
  openInterest: Int,
  highFillBuyPrice: String,
  highFillSellPrice: String
}
type Greeks {
  delta: String,
  gamma: String,
  theta: String
}
`;

export const resolvers = {
  Query: {
    optionInstrument: async (
      _source: any,
      {
        stockSymbol,
        expirationDate,
        strikePrice
      }: { stockSymbol: string; expirationDate: string; strikePrice: string },
      //@ts-ignore
      { dataSources: { RobinhoodAPI } }
    ) => {
      console.log(stockSymbol);
      console.log(expirationDate);
      console.log(strikePrice);
      return {};
    }
  }
};
