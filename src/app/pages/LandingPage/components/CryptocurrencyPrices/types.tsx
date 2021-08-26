export interface IPairData {
  trading_pairs: string;
  base_symbol: string;
  base_id: string;
  quote_symbol: string;
  quote_id: string;
  last_price: number;
  last_price_usd: number;
  high_price_24h: number;
  lowest_price_24h: number;
  base_volume: number;
  quote_volume: number;
  price_change_percent_24h: number;
  price_change_percent_24h_usd: number;
  price_change_week: number;
  price_change_week_usd: number;
}

export interface IPairs {
  [key: string]: IPairData;
}

export type IPairsData = {
  pairs: IPairs;
  total_volume_btc: number;
  total_volume_usd: number;
  updated_at: string;
};

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
