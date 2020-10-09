/**
 *
 * LenderBalance
 *
 */
import React, { useEffect, useState } from 'react';
import { Asset } from '../../../types/asset';
import { bignumber } from 'mathjs';
import { useAccount } from '../../hooks/useAccount';
import { Tooltip } from '@blueprintjs/core';
import { weiTo18, weiTo4 } from '../../../utils/blockchain/math-helpers';
import { useLending_profitOf } from '../../hooks/lending/useLending_profitOf';
import { useLending_assetBalanceOf } from '../../hooks/lending/useLending_assetBalanceOf';
import { UnLendBalance } from '../UnLendBalance/Loadable';
import { useLending_supplyInterestRate } from '../../hooks/lending/useLending_supplyInterestRate';

interface Props {
  asset: Asset;
}

export function LenderBalance(props: Props) {
  const owner = useAccount();
  const { value: balanceCall } = useLending_assetBalanceOf(props.asset, owner);
  const { value: profitCall } = useLending_profitOf(props.asset, owner);
  const { value: interestCall } = useLending_supplyInterestRate(props.asset);
  const [balance, setBalance] = useState(
    bignumber(balanceCall).minus(profitCall).toString(),
  );
  const [profit, setProfit] = useState(profitCall);
  const [ticker, setTicker] = useState('0');

  useEffect(() => {
    setBalance(bignumber(balanceCall).minus(profitCall).toString());
  }, [balanceCall, profitCall]);

  useEffect(() => {
    setTicker(
      bignumber(balance)
        .mul(
          bignumber(interestCall).div(100).div(31536000 /* seconds in year */),
        )
        .div(10 ** 18)
        .toFixed(0),
    );
  }, [balance, interestCall]);

  useEffect(() => {
    const ms = 1000;
    const diff = bignumber(ticker).div(1000).div(ms);
    let value = bignumber(profitCall).add(profit);
    const interval = setInterval(() => {
      value = value.add(diff);
      setProfit(value.toFixed(0));
    }, ms);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profitCall, ticker]);

  if (bignumber(balance).greaterThan(0)) {
    return (
      <>
        <div className="bg-component-bg align-items-center mt-3 p-5 text-center">
          <div className="bg-fieldBackground py-2 px-2">
            <div className="row px-3">
              <div className="data-label col-6 font-weight-bold">
                Balance Lent
              </div>
              <div className="col-6 data-container">
                <Tooltip
                  className=""
                  content={
                    <>
                      {weiTo18(balance)} {props.asset}
                    </>
                  }
                >
                  <>
                    {weiTo4(balance)}
                    <span className="text-lightGrey font-weight-light">
                      {` ${props.asset}`}
                    </span>
                  </>
                </Tooltip>
              </div>
            </div>
            <div className="row px-3">
              <div className="data-label col-6 font-weight-bold">Profit</div>
              <div className="col-6 data-container">
                <Tooltip
                  className=""
                  content={
                    <>
                      {weiTo18(profit)} {props.asset}
                    </>
                  }
                >
                  <>
                    {weiTo4(profit)}
                    <span className="text-lightGrey font-weight-light">
                      {` ${props.asset}`}
                    </span>
                  </>
                </Tooltip>
              </div>
            </div>
          </div>
          <UnLendBalance asset={props.asset} />
        </div>
      </>
    );
  }

  return <></>;
}
