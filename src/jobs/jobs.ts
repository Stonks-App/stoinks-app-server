import { discordMessagePull } from '../gqlModules/shared/dataSources/DiscordAPI';
import logger from '../utils/log/logger';

const channels = [
  '694323672483364874', //Swing Trades
  '656359404232245258', //Master AI signals
  '736993630945935490', //Day Trade
  '705664475365113956', //Diamond AI signals
  '705663779165437982' //Primary Flow
  // '575108105239527454', //Main Chat
  // '708426589209231490', //High Roller Chat
  // '664322152572518412' //Member Signals
];

const discordSync = async () => {
  logger.debug('Fetching messages');
  for (let channel in channels) [await discordMessagePull(channels[channel])];
  setTimeout(discordSync, 5000);
};

export const startDiscordJob = () => {
  logger.info('Discord job started');
  discordSync();
};
