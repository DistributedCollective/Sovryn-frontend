/**
 *
 * LiquidityAddContainer
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';
import { translations } from 'locales/i18n';
import { FormSelect } from '../../components/FormSelect';
import { weiTo18 } from '../../../utils/blockchain/math-helpers';
import { SendTxProgress } from '../../components/SendTxProgress';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useApproveAndAddLiquidity } from '../../hooks/amm/useApproveAndAddLiquidity';
import { FieldGroup } from '../../components/FieldGroup';
import { AmountField } from '../AmountField';
import { AssetWalletBalance } from '../../components/AssetWalletBalance';
import { TradeButton } from '../../components/TradeButton';
import { useAssetBalanceOf } from '../../hooks/useAssetBalanceOf';
import { useCanInteract } from '../../hooks/useCanInteract';
import { LiquidityPoolDictionary } from '../../../utils/dictionaries/liquidity-pool-dictionary';
import { usePoolToken } from '../../hooks/amm/usePoolToken';
import { ExpectedPoolTokens } from './ExpectedPoolTokens';
import { maxMinusFee } from '../../../utils/helpers';
import { useMaintenance } from '../../hooks/useMaintenance';

const pools = LiquidityPoolDictionary.list();
const poolList = pools.map(item => ({
  key: item.getAsset(),
  label: item.getAssetDetails().symbol,
}));

interface Props {}

export function LiquidityAddContainer(props: Props) {
  const { t } = useTranslation();
  const isConnected = useCanInteract();

  const [pool, setPool] = useState(poolList[0].key);

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

  usePoolToken(pool, sourceToken);

  const [amount, setAmount] = useState('');

  const balance = useAssetBalanceOf(sourceToken);
  const weiAmount = useWeiAmount(amount);

  const tx = useApproveAndAddLiquidity(pool, sourceToken, weiAmount, '1');

  const { checkMaintenance } = useMaintenance();
  const liquidityLocked = checkMaintenance('changeLiquidity');

  const handleSupply = useCallback(() => {
    tx.deposit();
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
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(balance.value)
    );
  };

  const { value: tokenBalance } = useAssetBalanceOf(sourceToken);

  return (
    <>
      <div className="tw-relative">
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
          <div className="lg:tw-col-span-6 tw-col-span-12 tw-px-4">
            <FieldGroup label={t(translations.liquidity.amount)}>
              <AmountField
                onChange={value => setAmount(value)}
                onMaxClicked={() =>
                  setAmount(weiTo18(maxMinusFee(tokenBalance, sourceToken)))
                }
                value={amount}
              />
            </FieldGroup>
          </div>
        </div>
        <ExpectedPoolTokens
          pool={pool}
          asset={sourceToken}
          amount={weiAmount}
        />
        <div className="tw-mt-4">
          <SendTxProgress {...tx} displayAbsolute={false} />
        </div>

        <div className="tw-flex tw-flex-col lg:tw-flex-row lg:tw-justify-between lg:tw-items-center">
          <div className="tw-mb-4 lg:tw-mb-0">
            <AssetWalletBalance asset={sourceToken} />
          </div>
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
