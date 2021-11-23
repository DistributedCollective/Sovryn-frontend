declare global {
  interface Window {
    ethereum: any;
    opera?: any;
    web3?: any;
    ResizeObserver: ResizeObserver;
  }
}

export {};
