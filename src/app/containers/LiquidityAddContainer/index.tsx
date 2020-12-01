/**
 *
 * LiquidityAddContainer
 *
 */

import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@blueprintjs/core';
import { bignumber } from 'mathjs';
import { translations } from 'locales/i18n';
import { FormSelect } from '../../components/FormSelect';
import { weiTo4, weiTo18 } from '../../../utils/blockchain/math-helpers';
import { SendTxProgress } from '../../components/SendTxProgress';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useExpectedPoolTokens } from '../../hooks/amm/useExpectedPoolTokens';
import { useApproveAndAddLiquidity } from '../../hooks/amm/useApproveAndAddLiquidity';
import { LoadableValue } from '../../components/LoadableValue';
import { liquidityPools } from '../../../utils/classifiers';
import { FieldGroup } from '../../components/FieldGroup';
import { AmountField } from '../AmountField';
import { AssetWalletBalance } from '../../components/AssetWalletBalance';
import { TradeButton } from '../../components/TradeButton';
import { useAssetBalanceOf } from '../../hooks/useAssetBalanceOf';
import { useCanInteract } from '../../hooks/useCanInteract';

interface Props {}

export function LiquidityAddContainer(props: Props) {
  const { t } = useTranslation();
  const isConnected = useCanInteract();
  const tokens = liquidityPools.map(item => ({
    key: item.source,
    target: item.target,
    label: item.label,
  }));

  const [sourceToken, setSourceToken] = useState(tokens[0].key);
  const [amount, setAmount] = useState('');

  const balance = useAssetBalanceOf(sourceToken);
  const weiAmount = useWeiAmount(amount);

  const expectedPoolTokens = useExpectedPoolTokens(sourceToken, weiAmount);

  const tx = useApproveAndAddLiquidity(sourceToken, weiAmount, '1');

  const handleSupply = useCallback(() => {
    tx.deposit();
  }, [tx]);

  const handlePoolChange = useCallback(item => {
    setSourceToken(item.key);
  }, []);

  const amountValid = () => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(balance.value)
    );
  };

  const { value: tokenBalance } = useAssetBalanceOf(sourceToken);

  return (
    <>
      <div className="position-relative">
        <div className="row">
          <div className="col-6 pr-1">
            <FieldGroup label={t(translations.liquidity.currency)}>
              <FormSelect
                onChange={handlePoolChange}
                placeholder={t(translations.liquidity.currencySelect)}
                value={sourceToken}
                items={tokens}
              />
            </FieldGroup>
          </div>
          <div className="col-6 pl-1">
            <FieldGroup label={t(translations.liquidity.amount)}>
              <AmountField
                onChange={value => setAmount(value)}
                onMaxClicked={() => setAmount(weiTo18(tokenBalance))}
                value={amount}
              />
            </FieldGroup>
          </div>
        </div>

        <div className="border shadow my-3 p-3 bg-white text-black">
          <div className="row">
            <div className="col">
              <div className="font-weight-bold small">
                <LoadableValue
                  loading={expectedPoolTokens.loading}
                  value={
                    <Text ellipsize tagName="span">
                      {weiTo4(expectedPoolTokens.value)}
                    </Text>
                  }
                  tooltip={expectedPoolTokens.value}
                />
              </div>
              <div className="small">{t(translations.liquidity.token)}</div>
            </div>
          </div>
        </div>

        {tx.type !== 'none' && (
          <div className="mt-3">
            <SendTxProgress {...tx} displayAbsolute={false} />
          </div>
        )}

        <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center">
          <div className="mb-3 mb-lg-0">
            <AssetWalletBalance asset={sourceToken} />
          </div>
          <TradeButton
            text={t(translations.liquidity.supply)}
            onClick={handleSupply}
            loading={tx.loading}
            disabled={!isConnected || tx.loading || !amountValid()}
          />
        </div>
      </div>
    </>
  );
}
