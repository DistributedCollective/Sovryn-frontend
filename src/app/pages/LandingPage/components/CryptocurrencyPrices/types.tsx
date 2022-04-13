export interface IAssetData {
  symbol: string;
  name: string;
  id: string;
  trading_fee: number;
  unified_cryptoasset_id: string;
  circulating_supply: number;
  updated: string;
}

export interface IAssets {
  [key: string]: IAssetData;
}
