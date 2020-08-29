import { DiscordMessage, ParsedDiscordMessage, OptionBuyOrder, OptionSellOrder, Ticker } from './types';
import { NYSESymbolList, NASDAQSymbolList, AMEXSymbolList } from '../../stockSymbols';
import logger from '../../../../utils/log/logger';

const getOperation = (messageContent: string): string => {
	let operation = 'N/A';
	operation = messageContent.includes('BTO') ? 'BTO' : operation;
	operation = messageContent.includes('STC') ? 'STC' : operation;
	operation = messageContent.includes('closing') ? 'STC' : operation;

	logger.debug(`Parsed Operation: ${operation}`);
	return operation;
};

const getTicker = (exchange: string, symbol: string): Ticker => {
	return { exchange, symbol };
};

const containsSymbol = (messageContent: string[], symbol: string): Boolean => {
	const sym = symbol.match(/\w+/g) || '';
	return messageContent.includes(sym[0]);
};

const searchForTicker = (messageContent: string) => {
	const tokenizedMessage = messageContent.split(/[\s\"]/);
	const NYSETickers = NYSESymbolList.filter((symbol) => containsSymbol(tokenizedMessage, symbol)).map((symbol) =>
		getTicker('NYSE', symbol)
	);

	const NASDAQTickers = NASDAQSymbolList.filter((symbol) => containsSymbol(tokenizedMessage, symbol)).map((symbol) =>
		getTicker('NASDAQ', symbol)
	);

	const AMEXTickers = AMEXSymbolList.filter((symbol) => containsSymbol(tokenizedMessage, symbol)).map((symbol) =>
		getTicker('AMEX', symbol)
	);

	return [ ...NYSETickers, ...NASDAQTickers, ...AMEXTickers ];
};

const getTickers = (messageContent: string, operation: string): Ticker[] => {
	let foundTickers: Ticker[] = [];

	if (operation !== 'N/A') {
		foundTickers = searchForTicker(messageContent);
		if (foundTickers.length > 1) {
			foundTickers = foundTickers.filter((ticker) => !ticker.symbol.includes('-'));
		}
		else if (foundTickers.length === 0) {
			foundTickers = searchForTicker(messageContent.toUpperCase());
		}
	}

	logger.debug(`Parsed Tickers: ${foundTickers}`);
	return foundTickers;
};

const getExpirationDate = (tokenizedMessage: string[]) => {
	const expirationDate = tokenizedMessage.filter((str) => str.includes('/'))[0] || tokenizedMessage[1];

	logger.debug(`Parsed Expiration Date ${expirationDate}`);
	return expirationDate;
};

const getOrderType = (messageContent: string, parsedStrike: string) => {
	let type = 'N/A';
	type = messageContent.includes('call') || messageContent.includes('CALL') ? 'CALL' : type;
	type = messageContent.includes('put') || messageContent.includes('PUT') ? 'PUT' : type;
	if (type === 'N/A') {
		if (parsedStrike.includes('c') || parsedStrike.includes('C')) {
			type = 'CALL';
		}
		else if (parsedStrike.includes('p') || parsedStrike.includes('P')) {
			type = 'PUT';
		}
		else {
			type = 'CALL';
		}
	}

	logger.debug(`Parsed OrderType: ${type}`);
	return type;
};

const getOrderTarget = (messageContent: string, strikePrice: string) => {
	const target: string[] = [];
	if (messageContent.includes('target') || messageContent.includes('Target')) {
		const targetSplits = messageContent.split('target') || messageContent.split('Target');
		let targetContent: string;
		if (targetSplits[1] !== undefined) {
			targetContent = targetSplits[1];
		}
		else {
			targetContent = targetSplits[0].split(strikePrice)[1];
		}
		const targets = targetContent.matchAll(/[\d.]+/g);
		for (const [ index ] of targets) {
			target.push(index);
		}
	}

	logger.debug(`Parsed Order Targets: ${target}`);
	return target;
};

const defaultOrder = {
	source: 'Discord',
	operation: 'N/A',
	tickers: []
};

export const parseTrade = (message: ParsedDiscordMessage): ParsedDiscordMessage => {
	logger.debug(`Parsing Message ${message.content}`);
	// parse order operation
	const operation = getOperation(message.content);

	// parse order Symbol
	const tickers = getTickers(message.content, operation);

	let order: OptionBuyOrder | OptionSellOrder = defaultOrder;

	try {
		if (operation === 'STC') {
			order = {
				source: 'Discord',
				operation,
				tickers
			};
		}
		else if (operation === 'BTO' && tickers.length > 0) {
			const tokenizedMessage = message.content.toUpperCase().split(tickers[0].symbol)[1].split(' ');

			const expirationDate = getExpirationDate(tokenizedMessage);

			const parsedStrike = [ tokenizedMessage[1], tokenizedMessage[2] ].filter(
				(str) => str !== expirationDate
			)[0];

			const type = getOrderType(message.content, parsedStrike);
			const strikePrice = parsedStrike.replace(/[^\d.]/g, '');
			const target = getOrderTarget(message.content, parsedStrike).filter((t) => parseInt(t) > 0);

			logger.debug('Finished Parsing Message');

			order = {
				source: 'Discord',
				operation,
				tickers,
				type,
				strikePrice,
				expirationDate,
				target
			};
		}
	} catch (error) {
		logger.error(error);
	}

	return {
		...message,
		order
	};
};

export const parseMessage = (message: DiscordMessage): ParsedDiscordMessage => {
	return message;
};
