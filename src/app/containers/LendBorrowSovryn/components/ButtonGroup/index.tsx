import React, { useEffect, useState } from 'react';
import { Button, Nav, Tab } from 'react-bootstrap';
import '../../assets/index.scss';
import clsx from 'clsx';
import { weiToFixed } from '../../../../../utils/blockchain/math-helpers';
import { Asset } from '../../../../../types/asset';
import { useLending_profitOf } from '../../../../hooks/lending/useLending_profitOf';
import { useLending_supplyInterestRate } from '../../../../hooks/lending/useLending_supplyInterestRate';
import { bignumber } from 'mathjs';
import { useAccount } from '../../../../hooks/useAccount';
import { useLending_assetBalanceOf } from '../../../../hooks/lending/useLending_assetBalanceOf';
import { Tooltip } from '@blueprintjs/core';

type Props = {
  currency: string;
  rightButton: string;
  leftButton: string;
  setCurrentButton: (current: string) => void;
};

const ButtonGroup: React.FC<Props> = ({
  currency,
  leftButton,
  rightButton,
  setCurrentButton,
}) => {
  const [key, setKey] = useState(leftButton);
  const asset = currency as Asset;
  const { value: profitCall } = useLending_profitOf(asset, useAccount());
  const { value: balanceCall } = useLending_assetBalanceOf(asset, useAccount());
  const { value: interestCall } = useLending_supplyInterestRate(asset);

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

  useEffect(() => {
    setCurrentButton(key);
  }, [key, setCurrentButton]);

  return (
    <>
      <div className="row">
        <Tab.Container id="button-group " defaultActiveKey={leftButton}>
          <Nav
            onSelect={k => setKey(k as string)}
            className="deposit-button-group w-100"
            variant="pills"
          >
            <Nav.Link eventKey={leftButton}>
              <Button
                variant="light"
                size="lg"
                className={clsx(
                  'button-deposit',
                  key === rightButton && 'disabled',
                )}
              >
                {leftButton}
              </Button>
            </Nav.Link>
            <Nav.Link eventKey={rightButton}>
              <Button
                variant="light"
                size="lg"
                className={clsx(
                  'button-deposit',
                  key === leftButton && 'disabled',
                )}
              >
                {rightButton}
              </Button>
            </Nav.Link>
          </Nav>
        </Tab.Container>
      </div>

      {key === 'Withdraw' && (
        <div className="container my-3">
          <div className="withdraw-content py-3 row">
            <div className="col-6">
              <h4>Balance</h4>
              <div>
                <span className="text-muted">{currency} </span>
                <strong>
                  <Tooltip
                    position="top"
                    content={<>{weiToFixed(balance, 18)}</>}
                  >
                    {weiToFixed(balance, 4)}
                  </Tooltip>
                </strong>
              </div>
            </div>
            <div className="col-6">
              <h4>Profit</h4>
              <div>
                <span className="text-muted">{currency} </span>
                <strong>
                  <Tooltip
                    position="top"
                    content={<>{weiToFixed(profit, 18)}</>}
                  >
                    {weiToFixed(profit, 8)}
                  </Tooltip>
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonGroup;
