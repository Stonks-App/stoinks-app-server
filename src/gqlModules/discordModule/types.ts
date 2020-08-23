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
	operation: string; // BTO, STC
	stockSymbol: string[];
};

export type OptionBuyOrder = OptionOrder & {
	type: string; // PUT, CALL
	strikePrice: string;
	expirationDate: string;
	target: string[];
};

export type OptionSellOrder = OptionOrder & {};
