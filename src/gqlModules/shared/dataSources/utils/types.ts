export type DiscordMessage = {
	id: string;
	content: string;
	author: Author;
	timestamp: string;
	embeds: Embeds[];
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

type Embeds = {
	type: string;
	title: string;
	fields: Fields[];
};

type Fields = {
	name: string;
	value: string;
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
