import { EventEmitter } from 'events';

const pushes: Record<string, number> = {};
const hub = new EventEmitter({ captureRejections: true });

export const pushPrice = (symbol: string, price: number) => {
  pushes[symbol] = price;
  hub.emit(symbol, price);
};

export const watchPrice = (
  symbol: string,
  onPrice: (price: number) => void,
) => {
  const listener = (price: number) => {
    onPrice(price);
  };

  if (pushes[symbol]) {
    onPrice(pushes[symbol]);
  }

  hub.on(symbol, listener);

  return () => {
    hub.removeListener(symbol, listener);
  };
};
