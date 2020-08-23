export const typeDefs = `
    extend type Query {
        getOptionInfo(stockSymbol: String): OptionInstrument
    }
    type OptionInstrument {
        meta: String
    }
`;

export const resolvers = {
	Query: {
		getOptionInfo: async (
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
			return {
				meta: 'hello'
			};
		}
	}
};

// _source: any,
// {
//   stockSymbol,
//   expirationDate,
//   strikePrice
// }: { stockSymbol: String; expirationDate: String; strikePrice: String },
// //@ts-ignore
// { dataSources: { RobinhoodAPI } }
