/**
 *
 * LiquidityRemoveContainer
 *
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Text } from '@blueprintjs/core/lib/esm/components/text/text';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { FormSelect } from '../../components/FormSelect';
import { LoadableValue } from '../../components/LoadableValue';
import { weiTo18, weiTo4, weiToFixed } from 'utils/blockchain/math-helpers';
import { SendTxProgress } from '../../components/SendTxProgress';
import { usePoolToken } from '../../hooks/amm/usePoolToken';
import { usePoolTokenBalance } from '../../hooks/amm/usePoolTokenBalance';
import { useRemoveLiquidityReturnAndFee } from '../../hooks/amm/useRemoveLiquidityReturnAndFee';
import { FieldGroup } from '../../components/FieldGroup';
import { AmountField } from '../AmountField';
import { TradeButton } from '../../components/TradeButton';
import { useApproveAndRemoveLiquidity } from '../../hooks/amm/useApproveAndRemoveLiquidity';
import { useIsConnected } from '../../hooks/useAccount';
import { useMaintenance } from '../../hooks/useMaintenance';
import { getPoolTokenContractName } from '../../../utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';
import { RemovePoolV1 } from './RemovePoolV1';

const pools = LiquidityPoolDictionary.list();
const poolList = pools.map(item => ({
  key: item.getAsset(),
  label: item.getAssetDetails().symbol,
}));

interface Props {}

export function LiquidityRemoveContainer(props: Props) {
  const { t } = useTranslation();
  const isConnected = useIsConnected();
  const [pool, setPool] = useState(poolList[0].key);

  const poolData = useMemo(() => {
    return LiquidityPoolDictionary.get(pool);
  }, [pool]);

  const prepareTokens = useCallback(() => {
    return LiquidityPoolDictionary.get(pool)
      .getSupplyAssets()
      .map(item => ({
        key: item.getAssetDetails().asset,
        label: item.getAssetDetails().symbol,
      }));
  }, [pool]);

  const [tokens, setTokens] = useState(prepareTokens());
  const [sourceToken, setSourceToken] = useState(tokens[0].key);

  const poolAddress = usePoolToken(pool, sourceToken);

  const balance = usePoolTokenBalance(pool, sourceToken);
  const [amount, setAmount] = useState(weiTo18(balance.value));

  const weiAmount = useWeiAmount(amount);

  const {
    value: targetValue,
    loading: targetLoading,
  } = useRemoveLiquidityReturnAndFee(pool, poolAddress.value, weiAmount);

  const tx = useApproveAndRemoveLiquidity(
    pool,
    sourceToken,
    poolAddress.value,
    weiAmount,
    '1',
  );

  const { checkMaintenance } = useMaintenance();
  const liquidityLocked = checkMaintenance('changeLiquidity');

  const handleWithdraw = useCallback(() => {
    tx.withdraw();
  }, [tx]);

  const handlePoolChange = useCallback(item => {
    setPool(item.key);
  }, []);

  const handleTokenChange = useCallback(item => {
    setSourceToken(item.key);
  }, []);

  useEffect(() => {
    const _tokens = prepareTokens();
    setTokens(_tokens);
    if (!_tokens.find(i => i.key === sourceToken)) {
      setSourceToken(_tokens[0].key);
    }
  }, [sourceToken, pool, prepareTokens]);

  const amountValid = () => {
    return Number(weiAmount) > 0 && Number(weiAmount) <= Number(balance.value);
  };

  const symbol = useCacheCallWithValue(
    getPoolTokenContractName(pool, sourceToken),
    'symbol',
    sourceToken,
  );

  usePoolToken(pool, sourceToken);

  return (
    <>
      <div className="row">
        <div className="col-lg-3 col-6">
          <FieldGroup label={t(translations.liquidity.pool)}>
            <FormSelect
              onChange={handlePoolChange}
              placeholder={t(translations.liquidity.poolSelect)}
              value={pool}
              items={poolList}
            />
          </FieldGroup>
        </div>
        {poolData.getVersion() === 2 && (
          <div className="col-lg-3 col-6">
            <FieldGroup label={t(translations.liquidity.currency)}>
              <FormSelect
                onChange={handleTokenChange}
                placeholder={t(translations.liquidity.currencySelect)}
                value={sourceToken}
                items={tokens}
              />
            </FieldGroup>
          </div>
        )}
        <div
          className={`${
            poolData.getVersion() === 1 ? 'col-lg-9' : 'col-lg-6'
          } col-12`}
        >
          <FieldGroup label={t(translations.liquidity.amount)}>
            <AmountField
              onChange={value => setAmount(value)}
              onMaxClicked={() => setAmount(weiTo18(balance.value))}
              value={amount}
            />
          </FieldGroup>
        </div>
      </div>

      {poolData.getVersion() === 1 ? (
        <RemovePoolV1
          poolData={poolData}
          value={amount}
          balance={balance}
          symbol={symbol.value}
        />
      ) : (
        <>
          <div className="border my-3 p-3 bg-white text-black">
            <div className="row">
              <div className="col">
                <div className="font-weight-bold small">
                  <LoadableValue
                    loading={targetLoading}
                    value={
                      <Text ellipsize>
                        {weiTo4(targetValue[0])} {sourceToken}
                      </Text>
                    }
                    tooltip={weiTo18(targetValue[0])}
                  />
                </div>
                <div className="small">
                  {t(translations.liquidity.amountTarget)}
                </div>
              </div>
              <div className="col">
                <div className="font-weight-bold small">
                  <LoadableValue
                    loading={targetLoading}
                    value={
                      <Text ellipsize>
                        {weiTo4(targetValue[1])} {sourceToken}
                      </Text>
                    }
                    tooltip={weiTo18(targetValue[1])}
                  />
                </div>
                <div className="small">{t(translations.liquidity.fee)}</div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <SendTxProgress {...tx} displayAbsolute={false} />
          </div>

          <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center">
            <div className="mb-3 mb-lg-0">
              <div>
                <div className="font-weight-bold text-muted mb-2">
                  {t(translations.assetWalletBalance.suppliedBalance)}
                </div>
                {!isConnected && (
                  <span>
                    {t(translations.assetWalletBalance.accountBalance)}
                  </span>
                )}
                {isConnected && (
                  <div className="d-flex flex-row justify-content-start align-items-center">
                    <span className="text-muted">{symbol.value}</span>
                    <span className="text-white font-weight-bold ml-2">
                      <LoadableValue
                        value={weiToFixed(balance.value, 4)}
                        loading={balance.loading}
                      />
                    </span>
                  </div>
                )}
              </div>
            </div>
            <TradeButton
              text={t(translations.liquidity.withdraw)}
              onClick={handleWithdraw}
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
        </>
      )}
    </>
  );
}
