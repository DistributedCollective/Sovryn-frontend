import React, { useEffect, useState } from 'react';
import { EventData } from 'web3-eth-contract';
import { weiTo18, weiTo4, weiToFixed } from 'utils/blockchain/math-helpers';
import { symbolByTokenAddress } from '../../../utils/blockchain/contract-helpers';
import { TradingHistoryItem } from '../TradingHistoryItem';
import { Tooltip } from '@blueprintjs/core';
import { bignumber } from 'mathjs';

interface Props {
  items: EventData[];
}

interface ItemState {
  prepared: boolean;
  loanId: string;
  loanToken: string;
  collateralToken: string;
  position: string;
  leverage: string;
  entryPrice: string;
  profit: string;
}

export function TradingHistoryListItems(props: Props) {
  const [items, setItems] = useState<EventData[]>([]);
  const [state, setState] = useState<ItemState>({
    prepared: false,
    loanId: '0x0',
    loanToken: null as any,
    collateralToken: null as any,
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

  if (!state.prepared) {
    return <></>;
  }

  return (
    <div
      className={`container bg-component-bg mb-3 ${
        !state.prepared ? 'bp3-skeleton' : ''
      }`}
    >
      {state.prepared && (
        <div className="row py-3 align-items-center">
          <div className="col-2">
            <strong>
              {state.loanToken}/{state.collateralToken}
            </strong>
          </div>
          <div className="col-2">
            <div>
              <strong>Position</strong>
            </div>
            <Tooltip content={<>{weiTo18(state.position)}</>}>
              {weiTo4(state.position)}
            </Tooltip>
          </div>
          <div className="col-2">
            <div>
              <strong>Leverage</strong>
            </div>
            <Tooltip content={<>{weiTo18(state.leverage)}</>}>
              <>x{weiToFixed(state.leverage, 0)}</>
            </Tooltip>
          </div>
          <div className="col-2">
            <div>
              <strong>Entry Price</strong>
            </div>
            <Tooltip content={<>{weiTo18(state.entryPrice)}</>}>
              {weiTo4(state.entryPrice)}
            </Tooltip>
          </div>
          <div className="col-2">
            <div>
              <strong>Profit</strong>
            </div>
            <Tooltip content={<>{weiTo18(state.profit)}</>}>
              {weiTo4(state.profit)}
            </Tooltip>
          </div>
        </div>
      )}

      <div>
        {items.map((item, index) => (
          <TradingHistoryItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
