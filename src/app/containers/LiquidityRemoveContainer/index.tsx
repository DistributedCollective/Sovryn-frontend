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

  return (
    <>
      <div className="tw-grid tw--mx-4 tw-grid-cols-12">
        <div className="lg:tw-col-span-3 tw-col-span-6 tw-px-4">
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
          <div className="lg:tw-col-span-3 tw-col-span-6 tw-px-4">
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
            poolData.getVersion() === 1 ? 'lg:tw-col-span-9' : 'lg:tw-col-span-6'
          } tw-col-span-12`}
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
          <div className="border tw-my-4 tw-p-4 tw-bg-white tw-text-black">
            <div className="tw-grid tw-gap-8 tw-grid-cols-12">
              <div className="tw-col-span-12">
                <div className="tw-font-bold small">
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
              <div className="tw-col-span-12">
                <div className="tw-font-bold small">
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

          <div className="tw-mt-4">
            <SendTxProgress {...tx} displayAbsolute={false} />
          </div>

          <div className="tw-flex tw-flex-col lg:tw-flex-row lg:tw-justify-between lg:tw-items-center">
            <div className="tw-mb-4 lg:tw-mb-0">
              <div>
                <div className="tw-font-bold tw-text-muted tw-mb-2">
                  {t(translations.assetWalletBalance.suppliedBalance)}
                </div>
                {!isConnected && (
                  <span>
                    {t(translations.assetWalletBalance.accountBalance)}
                  </span>
                )}
                {isConnected && (
                  <div className="tw-flex tw-flex-row tw-justify-start tw-items-center">
                    <span className="tw-text-muted">{symbol.value}</span>
                    <span className="tw-text-white tw-font-bold tw-ml-2">
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
