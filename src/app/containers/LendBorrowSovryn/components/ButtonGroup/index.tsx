import React, { useEffect, useMemo, useState } from 'react';
import { Button, Nav, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Tooltip, Text } from '@blueprintjs/core';
import { translations } from 'locales/i18n';
import '../../assets/index.scss';
import clsx from 'clsx';
import { weiToFixed } from '../../../../../utils/blockchain/math-helpers';
import { Asset } from '../../../../../types/asset';
import { useLending_profitOf } from '../../../../hooks/lending/useLending_profitOf';
import { bignumber } from 'mathjs';
import { useAccount } from '../../../../hooks/useAccount';
import { useLending_assetBalanceOf } from '../../../../hooks/lending/useLending_assetBalanceOf';
import { ButtonType } from '../../types';
import { AssetRenderer } from '../../../../components/AssetRenderer';

type Props = {
  currency: Asset;
  rightButton: ButtonType;
  leftButton: ButtonType;
  setCurrentButton: (current: ButtonType) => void;
  setBorrowAmount?: (amount: string) => void;
};

const ButtonGroup: React.FC<Props> = ({
  currency,
  leftButton,
  rightButton,
  setCurrentButton,
  setBorrowAmount,
}) => {
  const [key, setKey] = useState(leftButton);
  const { t } = useTranslation();
  const asset = currency as Asset;
  const { value: profitCall } = useLending_profitOf(asset, useAccount());
  const { value: balanceCall } = useLending_assetBalanceOf(asset, useAccount());
  // const { value: interestCall } = useLending_supplyInterestRate(asset);

  // const [profit, setProfit] = useState(profitCall);
  // const [ticker, setTicker] = useState('0');

  // useEffect(() => {
  //   setProfit('0');
  // }, [currency]);

  const balance = useMemo(() => {
    return bignumber(balanceCall).minus(profitCall).toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceCall, profitCall, currency]);

  // useEffect(() => {
  //   setTicker(
  //     bignumber(balance)
  //       .mul(
  //         bignumber(interestCall).div(100).div(31536000 /* seconds in year */),
  //       )
  //       .div(10 ** 18)
  //       .toFixed(0),
  //   );
  // }, [balance, interestCall]);

  // useEffect(() => {
  //   const ms = 1000;
  //   const diff = bignumber(ticker).div(1000).div(ms);
  //   let value = bignumber(profitCall).add(profit);
  //   console.log('add profit', value);
  //   const interval = setInterval(() => {
  //     value = value.add(diff);
  //     setProfit(value.toFixed(0));
  //   }, ms);
  //   return () => {
  //     clearInterval(interval);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [profitCall, ticker, currency]);

  useEffect(() => {
    setCurrentButton(key);
  }, [key, setCurrentButton]);

  return (
    <>
      <div className="tw-grid tw--mx-4 tw-grid-cols-12">
        <Tab.Container id="button-group" defaultActiveKey={leftButton}>
          <Nav
            onSelect={k => setKey((k as unknown) as ButtonType)}
            className="tw-col-span-12 deposit-button-group tw-w-full"
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
                {t(translations.lendingPage.tabs[leftButton])}
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
                {t(translations.lendingPage.tabs[rightButton])}
              </Button>
            </Nav.Link>
          </Nav>
        </Tab.Container>
      </div>

      {(key === ButtonType.REDEEM || key === ButtonType.DEPOSIT) && (
        <div className="tw-container tw-mx-auto tw-px-4 tw-my-4">
          <div className="withdraw-content tw-py-4 tw-grid tw-grid-cols-2 tw-gap-8 tw--mx-4">
            <div className="tw-flex tw-flex-col tw-pl-4">
              <h4 className="tw-flex-grow">
                <Text className="tw-break-normal">
                  {t(translations.lend.container.balance)}
                </Text>
              </h4>
              <div>
                <span className="tw-text-muted">
                  <AssetRenderer asset={currency} />
                </span>{' '}
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
            <div className="tw-flex tw-flex-col">
              <h4 className="tw-flex-grow">
                <Text className="tw-text-break">
                  {t(translations.lend.container.profit)}
                </Text>
              </h4>
              <div>
                <span className="tw-text-muted">
                  <AssetRenderer asset={currency} />
                </span>{' '}
                <strong>
                  <Tooltip
                    position="top"
                    content={<>{weiToFixed(profitCall, 18)}</>}
                  >
                    {weiToFixed(profitCall, 8)}
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
