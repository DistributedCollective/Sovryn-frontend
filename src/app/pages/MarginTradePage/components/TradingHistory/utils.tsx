import { bignumber } from 'mathjs';
import { Asset } from '../../../../../types';
import { TradingPosition } from 'types/trading-position';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { toWei } from 'utils/blockchain/math-helpers';
import { EventType } from './types';

export interface ICustomEvent {
  loanId: string;
  loanToken: Asset;
  collateralToken: Asset;
  position: TradingPosition;
  type: EventType;
  leverage: string;
  positionSize: string;
  price: string;
  txHash: string;
  isOpen: boolean;
  time: number;
  event: string;
  collateralToLoanRate: string;
}

export interface IEventData {
  data: Array<ICustomEvent>;
  isOpen: boolean;
  loanId: string;
}

export interface ICalculatedEvent {
  loanId: string;
  position: TradingPosition;
  loanToken: Asset;
  collateralToken: Asset;
  leverage: string;
  positionSize: string;
  entryPrice: string;
  closePrice: string;
  profit: string;
  entryTxHash: string;
  closeTxHash: string;
  time: number;
}

export const normalizeEvent = (
  event: ICustomEvent,
  isOpen: boolean,
): ICustomEvent | undefined => {
  const loanToken = AssetsDictionary.getByTokenContractAddress(event.loanToken)
    .asset;
  const collateralToken = AssetsDictionary.getByTokenContractAddress(
    event.collateralToken,
  ).asset;
  const pair = TradingPairDictionary.findPair(loanToken, collateralToken);

  if (pair === undefined) {
    return undefined;
  }

  const position =
    pair.longAsset === loanToken ? TradingPosition.LONG : TradingPosition.SHORT;

  const { loanId } = event;
  let type;
  if (event.event === 'Trade') {
    type = EventType.BUY;
  }
  if (event.event === 'CloseWithSwap') {
    type = EventType.SELL;
  }

  return {
    loanId,
    loanToken,
    collateralToken,
    position,
    type: type,
    leverage: event.leverage + 1,
    positionSize: event.positionSize,
    price: event.collateralToLoanRate,
    txHash: event.txHash,
    isOpen: isOpen,
    time: event.time,
    event: event.event,
    collateralToLoanRate: event.collateralToLoanRate,
  };
};

export const calculateProfits = (
  events: ICustomEvent[],
): ICalculatedEvent | null => {
  const opens = events.filter(item => item.type === EventType.BUY);
  const closes = events.filter(item => item.type === EventType.SELL);
  const positionSize = opens
    .reduce(
      (previous, current) => previous.add(current.positionSize),
      bignumber('0'),
    )
    .toString();

  const pair = TradingPairDictionary.findPair(
    opens[0].loanToken,
    opens[0].collateralToken,
  );

  const prettyPrice = (amount: string) => {
    return events[0].loanToken === pair.shortAsset
      ? amount
      : toWei(
          bignumber(1)
            .div(amount)
            .mul(10 ** 18),
        );
  };

  const entryPrice = prettyPrice(opens[0].collateralToLoanRate);
  const closePrice = prettyPrice(
    closes[closes.length - 1].collateralToLoanRate,
  );

  let change = bignumber(bignumber(closePrice).minus(entryPrice))
    .div(entryPrice)
    .toNumber();
  if (events[0].position === TradingPosition.SHORT) {
    change = bignumber(bignumber(entryPrice).minus(closePrice))
      .div(entryPrice)
      .toNumber();
  }

  const profit = bignumber(change).mul(bignumber(positionSize)).toFixed(0);

  return {
    loanId: events[0].loanId,
    position: events[0].position,
    collateralToken: events[0].collateralToken,
    loanToken: events[0].loanToken,
    leverage: events[0].leverage,
    positionSize,
    entryPrice,
    closePrice,
    profit: profit,
    entryTxHash: opens[0].txHash || '',
    closeTxHash: closes[closes.length - 1].txHash || '',
    time: events[0].time,
  };
};
