import { DiscordMessage, ParsedDiscordMessage, OptionBuyOrder, OptionSellOrder } from '../types';
import { recentSymbols, NYSESymbolList, NASDAQSymbolList, ETFSymbolList } from '../../shared/stockSymbols';

const getOperation = (messageContent: string): string => {
	let operation = 'N/A';
	operation = messageContent.includes('BTO') ? 'BTO' : operation;
	operation = messageContent.includes('STC') ? 'STC' : operation;
	operation = messageContent.includes('closing') ? 'STC' : operation;
	return operation;
};

const containsSymbol = (messageContent: string[], symbol: string): Boolean => {
	const sym = symbol.match(/\w+/g) || '';
	return messageContent.includes(sym[0]);
};

const getStockSymbol = (messageContent: string, operation: string): string[] => {
	let foundSymbol: string[] = [];

	if (operation !== 'N/A') {
		const tokenizedMessage = messageContent.split(/[\s\"]/);
		foundSymbol = recentSymbols.filter((symbol) => containsSymbol(tokenizedMessage, symbol));
		foundSymbol = foundSymbol.concat(NYSESymbolList.filter((symbol) => containsSymbol(tokenizedMessage, symbol)));
		foundSymbol = foundSymbol.concat(NASDAQSymbolList.filter((symbol) => containsSymbol(tokenizedMessage, symbol)));
		foundSymbol = foundSymbol.concat(ETFSymbolList.filter((symbol) => containsSymbol(tokenizedMessage, symbol)));
	}
	return foundSymbol;
};

const defaultOrder = {
	operation: 'N/A',
	stockSymbol: []
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
	return target;
};

export const parseMessage = (message: DiscordMessage): ParsedDiscordMessage => {
	// parse order operation
	const operation = getOperation(message.content);

	// parse order Symbol
	const stockSymbol = getStockSymbol(message.content, operation);

	let order: OptionBuyOrder | OptionSellOrder = defaultOrder;

	try {
		if (operation === 'STC') {
			order = {
				operation,
				stockSymbol
			};
		}
		else if (operation === 'BTO' && stockSymbol.length > 0) {
			const tokenizedMessage = message.content.split(stockSymbol[0])[1].split(' ');

			const expirationDate = tokenizedMessage.filter((str) => str.includes('/'))[0] || tokenizedMessage[1];
			const parsedStrike = [ tokenizedMessage[1], tokenizedMessage[2] ].filter(
				(str) => str !== expirationDate
			)[0];
			const type = getOrderType(message.content, parsedStrike);
			const strikePrice = parsedStrike.replace(/[^\d.]/g, '');
			const target = getOrderTarget(message.content, parsedStrike).filter((t) => parseInt(t) > 0);

			order = {
				operation,
				stockSymbol,
				type,
				strikePrice,
				expirationDate,
				target
			};
		}
	} catch (error) {
		console.error(error);
	}

	return {
		...message,
		order
	};
};
