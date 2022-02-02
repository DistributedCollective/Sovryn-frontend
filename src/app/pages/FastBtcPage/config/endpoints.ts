import { AppMode } from 'types';

export type ChainToEndpointMap = Partial<Record<AppMode, string>>;

export const endpoints: ChainToEndpointMap = {
  [AppMode.MAINNET]: 'https://fastbtc.sovryn.app',
  [AppMode.TESTNET]: 'https://fastbtc.test.sovryn.app',
};
