/**
 *
 * LiquidityAddContainer
 *
 */

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import {
  fromWei,
  toWei,
  weiTo18,
} from '../../../utils/blockchain/math-helpers';
import { FieldGroup } from '../../components/FieldGroup';
import { AmountField } from '../AmountField';
import { useCanInteract } from '../../hooks/useCanInteract';
import { maxMinusFee } from '../../../utils/helpers';
import { LiquidityPool } from '../../../utils/models/liquidity-pool';
import { Asset } from '../../../types';
import { DummyField } from '../../components/DummyField';
import { BalanceV1 } from './BalanceV1';
import { useApproveAndAddV1Liquidity } from '../../hooks/amm/useApproveAndAddV1Liquidity';
import { useMaintenance } from '../../hooks/useMaintenance';
import { TradeButton } from '../../components/TradeButton';
import { bignumber } from 'mathjs';
import { usePoolToken } from '../../hooks/amm/usePoolToken';
import { SendTxProgress } from '../../components/SendTxProgress';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../WalletProvider/selectors';

interface Props {
  pool: LiquidityPool;
}

export function PoolV1(props: Props) {
  const { assetRates: rates } = useSelector(selectWalletProvider);

  const { t } = useTranslation();
  const isConnected = useCanInteract();

  const tokens = useMemo(() => {
    return props.pool.getSupplyAssets().map(item => ({
      key: item.getAssetDetails().asset,
      label: item.getAssetDetails().symbol,
    }));
  }, [props.pool]);

  const [amounts, setAmounts] = useState({});
  const [balances, setBalances] = useState({});

  const getAmount = (token: Asset) => amounts[token] || '0';
  const setAmount = (token: Asset) => (value: string) => {
    setAmounts(prevState => ({ ...prevState, [token]: value }));

    const targets = tokens
      .filter(item => item.key !== token)
      .map(item => item.key);
    for (const target of targets) {
      const item = rates.find(
        item => item.source === token && item.target === target,
      );
      const rate = item ? item.value.rate : '0';
      let amount = '0';
      if (rate !== '0') {
        amount = fromWei(bignumber(value || '0').mul(rate));
      }
      setAmounts(prevState => ({ ...prevState, [target]: amount }));
    }
  };

  const getBalance = (token: Asset) => balances[token] || '0';
  const setBalance = (token: Asset) => (value: string) =>
    setBalances(prevState => ({ ...prevState, [token]: value }));

  const tx = useApproveAndAddV1Liquidity(
    props.pool.getAsset(),
    tokens.map(item => item.key),
    tokens.map(item => toWei(getAmount(item.key))),
    '1',
  );

  const handleSupply = useCallback(() => {
    tx.deposit();
  }, [tx]);

  const { checkMaintenance, States } = useMaintenance();
  const liquidityLocked = checkMaintenance(States.ADD_LIQUIDITY);

  const amountValid = () => {
    return !tokens
      .map(item => {
        const amount = bignumber(toWei(getAmount(item.key)));
        return (
          amount.greaterThan(0) &&
          amount.lessThanOrEqualTo(getBalance(item.key))
        );
      })
      .includes(false);
  };
  usePoolToken(props.pool.getAsset(), props.pool.getAsset());
  return (
    <>
      <div className="tw-relative">
        {tokens.map(item => (
          <div className="tw-grid tw-grid-cols-12" key={item.key}>
            <div className="lg:tw-col-span-3 tw-col-span-6 lg:tw-order-1">
              <FieldGroup label={t(translations.liquidity.currency)}>
                <DummyField>{item.label}</DummyField>
              </FieldGroup>
            </div>
            <div className="lg:tw-col-span-3 tw-col-span-6 lg:tw-order-3">
              <FieldGroup label={t(translations.liquidity.v1.balance)}>
                <DummyField>
                  <BalanceV1
                    asset={item.key}
                    onBalance={value => setBalance(item.key)(value)}
                  />
                </DummyField>
              </FieldGroup>
            </div>
            <div className="lg:tw-col-span-6 tw-col-span-12 lg:tw-order-2">
              <FieldGroup label={t(translations.liquidity.amount)}>
                <AmountField
                  onChange={setAmount(item.key)}
                  onMaxClicked={() =>
                    setAmount(item.key)(
                      weiTo18(maxMinusFee(getBalance(item.key), item.key)),
                    )
                  }
                  value={getAmount(item.key)}
                />
              </FieldGroup>
            </div>
          </div>
        ))}
        {/*<ExpectedPoolTokensV1 pool={props.pool} amounts={amounts} />*/}
        <div className="mt-3">
          <SendTxProgress {...tx} displayAbsolute={false} />
        </div>

        <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center">
          <TradeButton
            text={t(translations.liquidity.supply)}
            onClick={handleSupply}
            loading={tx.loading}
            disabled={
              !isConnected || tx.loading || !amountValid() || liquidityLocked
            }
            tooltip={
              liquidityLocked ? (
                <div className="mw-tooltip">
                  {t(translations.maintenance.addLiquidity)}
                </div>
              ) : undefined
            }
          />
        </div>
      </div>
    </>
  );
}
