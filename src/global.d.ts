declare global {
  interface Window {
    ethereum: any;
    opera?: any;
    web3?: any;
    ResizeObserver: ResizeObserver;
    cookieStore: {
      get(key: string): string;
      getObject(key: string): any;
      getAll(): any;
      put(key: string, value: string, options?: any): void;
      putObject(key: string, value: any, options?: any): void;
      remove(key: string, options?: any): void;
    };
    location: {
      href: string;
    };
  }
}

export {};
