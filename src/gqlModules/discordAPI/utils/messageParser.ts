import { DiscordMessage, ParsedDiscordMessage, OptionBuyOrder, OptionSellOrder } from '../types';
import { recentSymbols, fullSymbolList } from '../../shared/stockSymbols';


const containsSymbol = (messageContent: string, symbol: string): Boolean => {
    return messageContent.includes(symbol);
}


export const parseMessage = (message: DiscordMessage): ParsedDiscordMessage => {

    // parse order operation
    let operation = 'N/A';
    operation = message.content.includes('BTO') ? 'BTO' : operation
    operation = message.content.includes('STC') ? 'STC' : operation

    // parse order Symbol

    let foundSymbol: string[] = [];
    if (operation !== 'N/A') {
        foundSymbol = recentSymbols.filter((symbol) => containsSymbol(message.content, symbol)).sort() || []
        if (foundSymbol.length < 1) {
            foundSymbol = fullSymbolList.filter((symbol) => containsSymbol(message.content, symbol)).sort() || []
            recentSymbols.push(...foundSymbol)
        }
    }

    let order: OptionBuyOrder | OptionSellOrder = {
        operation: 'N/A',
        stockSymbol: 'N/A'
    }

    if (operation === 'STC') {
        order = {
            operation,
            stockSymbol: foundSymbol[0] || 'N/A',
        }
    }

    if (operation === 'BTO' && foundSymbol.length > 0) {
        // parse order type
        let type = 'N/A';
        type = message.content.includes('call') ? 'CALL' : type
        type = message.content.includes('put') ? 'PUT' : type

        // get expiration
        const tokenizedContent = message.content.split(foundSymbol[0])[1].split(' ');
        const expirationDate = tokenizedContent[1];

        const parsedStrike = tokenizedContent[2];
        if (type === 'N/A') {
            if (parsedStrike.includes('c')) {
                type = 'CALL'
            }
            if (parsedStrike.includes('p')) {
                type = 'PUT'
            }
        }

        const strikePrice = parsedStrike.replace(/[^\d.]/g,"");

        // 
        const target: string[] = [];
        if (message.content.includes('target')) {
            const targetContent = message.content.split('target')[1];
            const targets = targetContent.matchAll(/[\d.]+/g)
            for (const [index] of targets) {
                target.push(index);
            }
        }

        order = {
            operation,
            type,
            stockSymbol: foundSymbol[0] || 'N/A',
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