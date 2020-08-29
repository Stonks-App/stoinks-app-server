export type DiscordMessage = {
	id: string;
	content: string;
	author: Author;
	timestamp: string;
};

export type ParsedDiscordMessage = DiscordMessage & {
	order?: OptionBuyOrder | OptionSellOrder;
};

export type Author = {
	username: string;
};

type OptionOrder = {
	source: string;
	operation: string; // BTO, STC
	tickers: Ticker[];
};

export type OptionBuyOrder = OptionOrder & {
	type: string; // PUT, CALL
	strikePrice: string;
	expirationDate: string;
	target: string[];
};

export type OptionSellOrder = OptionOrder & {};

export type Ticker = {
	exchange: string;
	symbol: string;
};
