/**
 *
 * LiquidityAddContainer
 *
 */

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { toWei, weiTo18 } from '../../../utils/blockchain/math-helpers';
import { FieldGroup } from '../../components/FieldGroup';
import { AmountField } from '../AmountField';
import { useCanInteract } from '../../hooks/useCanInteract';
import { maxMinusFee } from '../../../utils/helpers';
import { LiquidityPool } from '../../../utils/models/liquidity-pool';
import { Asset } from '../../../types/asset';
import { DummyField } from '../../components/DummyField';
import { BalanceV1 } from './BalanceV1';
import { useApproveAndAddV1Liquidity } from '../../hooks/amm/useApproveAndAddV1Liquidity';
import { useMaintenance } from '../../hooks/useMaintenance';
import { TradeButton } from '../../components/TradeButton';
import { bignumber } from 'mathjs';
import { usePoolToken } from '../../hooks/amm/usePoolToken';
import { SendTxProgress } from '../../components/SendTxProgress';

interface Props {
  pool: LiquidityPool;
}

export function PoolV1(props: Props) {
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
  const setAmount = (token: Asset) => (value: string) =>
    setAmounts(prevState => ({ ...prevState, [token]: value }));

  const getBalance = (token: Asset) => balances[token] || '0';
  const setBalance = (token: Asset) => (value: string) =>
    setBalances(prevState => ({ ...prevState, [token]: value }));

  //
  // usePoolToken(pool, sourceToken);
  //
  // const [amount, setAmount] = useState('');
  //
  // const balance = useAssetBalanceOf(sourceToken);
  // const weiAmount = useWeiAmount(amount);
  //
  const tx = useApproveAndAddV1Liquidity(
    props.pool.getAsset(),
    tokens.map(item => item.key),
    tokens.map(item => toWei(getAmount(item.key))),
    '1',
  );

  const handleSupply = useCallback(() => {
    tx.deposit();
  }, [tx]);
  //
  // const handlePoolChange = useCallback(item => {
  //   setPool(item.key);
  // }, []);
  //
  // const handleTokenChange = useCallback(item => {
  //   setSourceToken(item.key);
  // }, []);
  //
  // useEffect(() => {
  //   const _tokens = prepareTokens();
  //   setTokens(_tokens);
  //   if (!_tokens.find(i => i.key === sourceToken)) {
  //     setSourceToken(_tokens[0].key);
  //   }
  // }, [sourceToken, pool, prepareTokens]);
  //
  // const amountValid = () => {
  //   return (
  //     bignumber(weiAmount).greaterThan(0) &&
  //     bignumber(weiAmount).lessThanOrEqualTo(balance.value)
  //   );
  // };

  // const { value: tokenBalance } = useAssetBalanceOf(sourceToken);

  const { checkMaintenance } = useMaintenance();
  const liquidityLocked = checkMaintenance('changeLiquidity');

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
      <div className="position-relative">
        {tokens.map(item => (
          <div className="row" key={item.key}>
            <div className="col-lg-3 col-6 order-lg-1">
              <FieldGroup label={t(translations.liquidity.currency)}>
                <DummyField>{item.label}</DummyField>
              </FieldGroup>
            </div>
            <div className="col-lg-3 col-6 order-lg-3">
              <FieldGroup label={t(translations.liquidity.v1.balance)}>
                <DummyField>
                  <BalanceV1
                    asset={item.key}
                    onBalance={value => setBalance(item.key)(value)}
                  />
                </DummyField>
              </FieldGroup>
            </div>
            <div className="col-lg-6 col-12 order-lg-2">
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
              !isConnected ||
              tx.loading ||
              !amountValid() ||
              liquidityLocked?.maintenance_active
            }
            tooltip={
              liquidityLocked?.maintenance_active ? (
                <div className="mw-tooltip">{liquidityLocked?.message}</div>
              ) : undefined
            }
          />
        </div>
      </div>
    </>
  );
}
