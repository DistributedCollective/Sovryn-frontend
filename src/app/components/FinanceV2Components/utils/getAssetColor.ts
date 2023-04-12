import { Asset } from '../../../../types';

export const getAssetColor = (asset: Asset) => {
  switch (asset) {
    case Asset.USDT:
      return '#66B29E';
    case Asset.BPRO:
      return '#E5DB5F';
    case Asset.SOV:
      return '#D5D5D5';
    case Asset.DOC:
      return '#4E805C';
    case Asset.ETH:
      return '#405398';
    case Asset.RBTC:
      return '#FFAC3E';
    case Asset.XUSD:
      return '#D5D5D5';
    case Asset.DLLR:
      return '#db6e4d';
    default:
      return '#FFAC3E';
  }
};
export const getAssetSecondaryColor = (asset: Asset) => {
  switch (asset) {
    case Asset.USDT:
      return '#376256';
    case Asset.BPRO:
      return '#86813F';
    case Asset.SOV:
      return '#6C6C6C';
    case Asset.DOC:
      return '#2C4E36';
    case Asset.ETH:
      return '#2E375A';
    case Asset.RBTC:
      return '#9B6A2A';
    case Asset.XUSD:
      return '#6C6C6C';
    default:
      return '#FFAC3E';
  }
};
