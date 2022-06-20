import { EventEmitter } from 'events';

const hub = new EventEmitter({ captureRejections: true });

export const pushPrice = (symbol: string, price: number) =>
  hub.emit(symbol, price);

export const watchPrice = (
  symbol: string,
  onPrice: (price: number) => void,
) => {
  const listener = (price: number) => onPrice(price);

  hub.on(symbol, listener);

  return () => {
    hub.removeListener(symbol, listener);
  };
};
