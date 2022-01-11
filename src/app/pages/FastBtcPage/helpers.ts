import { Asset } from 'types';
import { FastBtcNetworkType } from './types';

export const getBTCAssetForNetwork = (network: FastBtcNetworkType) => {
  return network === FastBtcNetworkType.BINANCE_SMART ? Asset.BTCS : Asset.RBTC;
};
