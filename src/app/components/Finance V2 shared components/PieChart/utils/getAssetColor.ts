import { Asset } from '../../../../../types/asset';

export const getAssetColor = (asset: Asset) => {
  switch (asset) {
    case Asset.USDT:
      return '#66B29E';
    case Asset.BPRO:
      return '#E5DB5F';
    case Asset.SOV:
      return '#D5D5D5';
    case Asset.DOC:
      return '#2C4E36';
    case Asset.ETH:
      return '#405398';
    case Asset.RBTC:
      return '#FFAC3E';
    default:
      return '#FFAC3E';
  }
};
