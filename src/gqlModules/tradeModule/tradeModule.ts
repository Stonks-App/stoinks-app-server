export const typeDefs = `
	extend type Query {
		trades(numTrades: Int = 20, tradeOperation: String = "ALL", author: String = "ALL"): [Trade]
	}

	type Trade {
		id: String,
		meta: TradeMeta,
		details: OptionTrade
	}

	type TradeMeta {
		author: String,
		source: String,
		timestamp: DateTime,
		originalMessage: String,
	}
`;

const tradeChannels = [
  { name: 'Nexus | Swing', channelID: '694323672483364874' },
  { name: 'Nexus | Master AI Signals', channelID: '656359404232245258' },
  { name: 'Nexus | Day Trade', channelID: '736993630945935490' }
];

const getTrade = (message: any, index: number) => {
  const { id, content, author, timestamp, order } = message;
  if (!order) {
    return null;
  }
  return {
    id,
    meta: {
      author: author.username,
      source: tradeChannels[index].name,
      timestamp,
      originalMessage: content
    },
    details: order
  };
};

export const resolvers = {
  Query: {
    trades: async (
      _source: any,
      {
        author,
        numTrades,
        tradeOperation
      }: { author: string; numTrades: number; tradeOperation: string },
      //@ts-ignore
      { dataSources: { discordAPI } }
    ) => {
      const messageArrays = await Promise.all(
        tradeChannels.map(({ channelID }) =>
          discordAPI.getDiscordMessageOrders(channelID, 100)
        )
      );

      let trades: any = [];

      messageArrays.forEach((messageArray, index) => {
        messageArray = messageArray
          .map((message: any) => getTrade(message, index))
          .filter((order: any) => !!order);
        trades = trades.concat(messageArray);
      });

      trades = trades.sort((order1: any, order2: any) => {
        const date1 = new Date(order1.meta.timestamp).getTime();
        const date2 = new Date(order2.meta.timestamp).getTime();
        return date2 - date1;
      });

      if (tradeOperation !== 'ALL') {
        trades = trades.filter(
          (trade: any) =>
            trade?.details?.operation === tradeOperation.toUpperCase()
        );
      }

      if (author !== 'ALL') {
        trades = trades.filter((trade: any) => trade?.meta?.author === author);
      }

      if (trades.length < numTrades) {
        return trades.slice(0, trades.length);
      }
      return trades.slice(0, numTrades);
    }
  }
};
