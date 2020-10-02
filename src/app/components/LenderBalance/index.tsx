/**
 *
 * LenderBalance
 *
 */
import React, { useEffect, useState } from 'react';
import { Asset } from '../../../types/asset';
import { bignumber } from 'mathjs';
import { getLendingContractName } from '../../../utils/blockchain/contract-helpers';
import { useAccount } from '../../hooks/useAccount';
import { fromWei } from 'web3-utils';
import { Tooltip } from '@blueprintjs/core';
import { UnLendBalance } from '../UnLendBalance';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';

interface Props {
  asset: Asset;
}

export function LenderBalance(props: Props) {
  const lendingContractName = getLendingContractName(props.asset);

  const owner = useAccount();
  const { value: balanceCall } = useCacheCallWithValue(
    lendingContractName,
    'assetBalanceOf',
    '0',
    owner,
  );

  const { value: tokenPrice } = useCacheCallWithValue(
    lendingContractName,
    'tokenPrice',
    '0',
  );
  const { value: checkpointPrice } = useCacheCallWithValue(
    lendingContractName,
    'checkpointPrice',
    '0',
    owner,
  );

  const { value: interestCall } = useCacheCallWithValue(
    lendingContractName,
    'nextSupplyInterestRate',
    '0',
    1000, // todo: why 1000?
  );

  const [balance, setBalance] = useState(bignumber(0));
  const [profit, setProfit] = useState(bignumber(0));
  const [tickerDiff, setTickerDiff] = useState(bignumber(0));
  const [tickerProfit, setTickerProfit] = useState(bignumber(0));
  const [interestRate, setInterestRate] = useState(bignumber(0));

  useEffect(() => {
    if (balanceCall !== undefined) {
      setBalance(bignumber(fromWei(balanceCall)));
    }
  }, [balanceCall]);
  useEffect(() => {
    if (interestCall !== undefined) {
      setInterestRate(bignumber(fromWei(interestCall)));
    }
  }, [interestCall]);

  useEffect(() => {
    if (
      tokenPrice !== undefined &&
      checkpointPrice !== undefined &&
      balance.greaterThan(0)
    ) {
      setProfit(
        bignumber(fromWei(tokenPrice))
          .minus(bignumber(fromWei(checkpointPrice)))
          .mul(balance)
          .div(10 ** 36),
      );

      setTickerDiff(
        balance.mul(interestRate.div(100)).div(31536000 /* seconds in year */),
      );
    }
  }, [tokenPrice, checkpointPrice, balance, interestRate]);

  useEffect(() => {
    const ms = 500;
    const diff = tickerDiff.toNumber() / (1000 / ms);
    let value = profit.toNumber();
    const interval = setInterval(() => {
      value = value + diff;
      setTickerProfit(bignumber(value));
    }, ms);
    return () => {
      clearInterval(interval);
    };
  }, [profit, tickerDiff]);

  if (balance.greaterThan(0)) {
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
                      {balance.toFixed(18)} {props.asset}
                    </>
                  }
                >
                  <>
                    {balance.toFixed(4)}
                    <span className="text-lightGrey font-weight-light">
                      {` ${props.asset}`}
                    </span>
                  </>
                </Tooltip>
              </div>
            </div>
            <div className="row px-3 mt-2">
              <div className="col-6 data-label font-weight-bold">Profit</div>
              <div className="col-6 data-container">
                <Tooltip
                  className=""
                  content={
                    <>
                      {tickerProfit.toFixed(18)} {props.asset}
                    </>
                  }
                >
                  <>
                    {tickerProfit.toFixed(4)}
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
