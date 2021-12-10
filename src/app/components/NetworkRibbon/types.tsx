export type Network = {
  name: string;
  chainId: number;
  shortName: string;
  chain: string;
  network: string;
  networkId: number;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpc: string[];
  faucets: string[];
  explorers: {
    name: string;
    url: string;
    standard?: string;
  }[];
  infoURL: string;
};
