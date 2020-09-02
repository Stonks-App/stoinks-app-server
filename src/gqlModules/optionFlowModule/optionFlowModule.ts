export const typeDefs = `
extend type Query { 
    optionFlow(numMessages: Int = 20, optionFlowOps: String): [OptionFlow]
}



`;

// discordMessages(channelID: "705664440644665426", numMessages: 1){
//     content,
//         author{
//         username
//     }
//     timestamp,
//         order{
//         source,
//             operation,
//             tickers{
//             exchange,
//                 symbol
//         }
//         type,
//             strikePrice,
//             expirationDate,
//             target
//     }
//     embeds{
//         type,
//             title,
//             fields {
//             name,
//                 value
//         }
//     }
