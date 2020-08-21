import { DiscordMessage, ParsedDiscordMessage, OptionBuyOrder, OptionSellOrder } from '../types';
import { recentSymbols, NYSESymbolList, NASDAQSymbolList, ETFSymbolList } from '../../shared/stockSymbols';

const getOperation = (messageContent: string): string => {
    let operation = 'N/A';
    operation = messageContent.includes('BTO') ? 'BTO' : operation;
    operation = messageContent.includes('STC') ? 'STC' : operation;
    return operation;
}

const containsSymbol = (messageContent: string[], symbol: string): Boolean => {
    return messageContent.includes(symbol);
}

const getStockSymbol = (messageContent: string, operation: string): string[] => {
    let foundSymbol: string[] = [];

    if (operation !== 'N/A') {
        const tokenizedMessage = messageContent.split(' ');
        foundSymbol = recentSymbols.filter((symbol) => containsSymbol(tokenizedMessage, symbol));
        foundSymbol = foundSymbol.concat(NYSESymbolList.filter((symbol) => containsSymbol(tokenizedMessage, symbol)));
        foundSymbol = foundSymbol.concat(NASDAQSymbolList.filter((symbol) => containsSymbol(tokenizedMessage, symbol)));
        foundSymbol = foundSymbol.concat(ETFSymbolList.filter((symbol) => containsSymbol(tokenizedMessage, symbol)));
    }
    return foundSymbol;
}

const defaultOrder = {
    operation: 'N/A',
    stockSymbol: []
}

const getOrderType = (messageContent: string, parsedStrike: string) => {
    let type = 'N/A';
    type = messageContent.includes('call') ? 'CALL' : type;
    type = messageContent.includes('put') ? 'PUT' : type;
    if (type === 'N/A') {
        if (parsedStrike.includes('c') || parsedStrike.includes('C')) {
            type = 'CALL';
        }
        if (parsedStrike.includes('p') || parsedStrike.includes('P')) {
            type = 'PUT';
        }
    }

    return type;
}

const getOrderTarget = (messageContent: string) => {
    const target: string[] = [];
    if (messageContent.includes('target')) {
        const targetContent = messageContent.split('target')[1];
        const targets = targetContent.matchAll(/[\d.]+/g)
        for (const [index] of targets) {
            target.push(index);
        }
    }
    return target;
}

export const parseMessage = (message: DiscordMessage): ParsedDiscordMessage => {
    // parse order operation
    const operation = getOperation(message.content);

    // parse order Symbol
    const stockSymbol = getStockSymbol(message.content, operation);

    let order: OptionBuyOrder | OptionSellOrder = defaultOrder;
    
    if (operation === 'STC') {
        order = {
            operation,
            stockSymbol
        }
    } else if (operation === 'BTO' && stockSymbol.length > 0) {
        const tokenizedMessage = message.content.split(stockSymbol[0])[1].split(' ');

        const expirationDate = tokenizedMessage.filter((str) => str.includes('/'))[0];
        const parsedStrike = [tokenizedMessage[1], tokenizedMessage[2]].filter((str) => str !== expirationDate)[0];
        const type = getOrderType(message.content, parsedStrike);
        const strikePrice = parsedStrike.replace(/[^\d.]/g,"");
        const target = getOrderTarget(message.content).filter((t) => parseInt(t) > 0);

        order = {
            operation,
            stockSymbol,
            type,
            strikePrice,
            expirationDate,
            target,
        };
    }

    return {
        ...message,
        order
    }

}