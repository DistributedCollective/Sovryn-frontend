import { useEffect, useState } from 'react';
import { EventData } from 'web3-eth-contract';
import { weiTo4, weiToFixed } from 'utils/blockchain/math-helpers';
import { symbolByTokenAddress } from '../../../utils/blockchain/contract-helpers';
import { bignumber } from 'mathjs';
import { Nullable } from 'types';

interface Props {
  items: EventData[];
}

interface ItemState {
  prepared: boolean;
  loanId: string;
  loanToken: Nullable<string>;
  collateralToken: Nullable<string>;
  position: string;
  leverage: string;
  entryPrice: string;
  profit: string;
}

export function useTradingHistoryRow(props: Props) {
  const [items, setItems] = useState<EventData[]>([]);
  const [state, setState] = useState<ItemState>({
    prepared: false,
    loanId: '0x0',
    loanToken: null,
    collateralToken: null,
    position: '0',
    leverage: '0',
    entryPrice: '0',
    profit: '0',
  });

  useEffect(() => {
    const sorted = props.items.sort((a, b) => b.blockNumber - a.blockNumber);
    setItems(sorted);

    const tradeEvent = sorted.find(item => item.event === 'Trade');
    let loanId = '0x0';

    let profit = '0';
    let entryPrice = '0';
    if (tradeEvent) {
      loanId = tradeEvent.returnValues.loanId;
      setState(prev => ({
        ...prev,
        ...{
          prepared: true,
          loanId: tradeEvent.returnValues.loanId,
          loanToken: symbolByTokenAddress(tradeEvent.returnValues.loanToken),
          collateralToken: symbolByTokenAddress(
            tradeEvent.returnValues.collateralToken,
          ),
          position: tradeEvent.returnValues.positionSize,
          entryPrice: tradeEvent.returnValues.entryPrice,
          leverage: tradeEvent.returnValues.currentLeverage,
        },
      }));

      entryPrice = bignumber(tradeEvent.returnValues.entryPrice).toFixed(0);
    }

    const sellEvents = sorted.filter(item => item.event === 'CloseWithSwap');
    if (sellEvents.length) {
      sellEvents.forEach(ev => {
        loanId = ev.returnValues.loanId;

        const priceDiff = bignumber(ev.returnValues.exitPrice).minus(
          entryPrice,
        );
        profit = bignumber(profit)
          .add(priceDiff.mul(bignumber(ev.returnValues.positionCloseSize)))
          .toFixed(0);
      });
    }

    setState(prev => ({
      ...prev,
      ...{
        loanId: loanId,
        profit: bignumber(profit)
          .div(10 ** 18)
          .toFixed(0),
      },
    }));
    setItems(sorted);
  }, [props.items /*, getLoan*/]);

  return {
    Pair: `${state.loanToken}/{state.collateralToken}`,
    Position: weiTo4(state.position),
    Leverage: weiToFixed(state.leverage, 0),
    EntryPrice: weiTo4(state.entryPrice),
    Profit: weiTo4(state.profit),
  };
}
