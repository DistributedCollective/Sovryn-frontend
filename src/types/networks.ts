export enum NetworkType {
  RSK,
}

declare global {
  interface Window {
    ethereum: any;
  }
}
