/**
 *
 * SwapTradeForm
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Icon } from '@blueprintjs/core';
import { FieldGroup } from '../../components/FieldGroup';
import { FormSelect } from '../../components/FormSelect';
import { AmountField } from '../AmountField';
import { weiTo18, weiToFixed } from '../../../utils/blockchain/math-helpers';
import { TradeButton } from '../../components/TradeButton';
import { Asset } from '../../../types/asset';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { translations } from 'locales/i18n';
import { DummyField } from '../../components/DummyField';
import { LoadableValue } from '../../components/LoadableValue';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { useSwapNetwork_conversionPath } from '../../hooks/swap-network/useSwapNetwork_conversionPath';
import { useSwapNetwork_rateByPath } from '../../hooks/swap-network/useSwapNetwork_rateByPath';
import { useSwapNetwork_approveAndConvertByPath } from '../../hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { SendTxProgress } from '../../components/SendTxProgress';
import { AssetWalletBalance } from '../../components/AssetWalletBalance';
import { useAssetBalanceOf } from '../../hooks/useAssetBalanceOf';
import { useCanInteract } from '../../hooks/useCanInteract';
import { maxMinusFee } from '../../../utils/helpers';
import {
  disableNewTrades,
  disableNewTradesText,
} from '../../../utils/classifiers';

const s = translations.swapTradeForm;

function tokenAddress(asset: Asset) {
  return AssetsDictionary.get(asset).getTokenContractAddress();
}

const color = 'var(--teal)';

interface Option {
  key: Asset;
  label: string;
}

export function SwapTradeForm() {
  const { t } = useTranslation();
  const isConnected = useCanInteract();

  const [amount, setAmount] = useState('');
  const [sourceToken, setSourceToken] = useState(Asset.DOC);
  const [targetToken, setTargetToken] = useState(Asset.BTC);
  const [sourceOptions, setSourceOptions] = useState<any[]>([]);
  const [targetOptions, setTargetOptions] = useState<any[]>([]);

  const weiAmount = useWeiAmount(amount);

  const { value: tokens } = useCacheCallWithValue<string[]>(
    'converterRegistry',
    'getConvertibleTokens',
    [],
  );

  const getOptions = useCallback(() => {
    return (tokens
      .map(item => {
        const asset = AssetsDictionary.getByTokenContractAddress(item);
        if (!asset) {
          return null;
        }
        return {
          key: asset.asset,
          label: asset.symbol,
        };
      })
      .filter(item => item !== null) as unknown) as Option[];
  }, [tokens]);

  useEffect(() => {
    const newOptions = getOptions();
    setSourceOptions(newOptions);

    if (
      !newOptions.find(item => item.key === sourceToken) &&
      newOptions.length
    ) {
      setSourceToken(newOptions[0].key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, targetToken]);

  useEffect(() => {
    const newOptions = getOptions();
    setTargetOptions(newOptions);

    if (
      !newOptions.find(item => item.key === targetToken) &&
      newOptions.length
    ) {
      setTargetToken(newOptions[0].key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, sourceToken]);

  const { value: path } = useSwapNetwork_conversionPath(
    tokenAddress(sourceToken),
    tokenAddress(targetToken),
  );

  const { value: rateByPath, loading } = useSwapNetwork_rateByPath(
    path,
    weiAmount,
  );

  const { send, ...tx } = useSwapNetwork_approveAndConvertByPath(
    path,
    weiAmount,
    rateByPath,
  );

  const { value: tokenBalance } = useAssetBalanceOf(sourceToken);

  const { state } = useLocation();

  useEffect(() => {
    const params: any = (state as any)?.params;
    if (params?.action && params?.action === 'swap' && params?.asset) {
      const item = getOptions().find(item => item.key === params.asset);
      if (item) {
        setSourceToken(item.key);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, tokens]);

  return (
    <>
      <FieldGroup label={t(s.fields.send)} labelColor={color}>
        <div className="tw-grid tw-gap-8 tw--mx-4tw-grid-cols-12">
          <div className="tw-col-span-8">
            <AmountField
              onChange={value => setAmount(value)}
              onMaxClicked={() =>
                setAmount(weiTo18(maxMinusFee(tokenBalance, sourceToken)))
              }
              value={amount}
            />
          </div>
          <div className="tw-col-span-4">
            <FormSelect
              onChange={value => setSourceToken(value.key)}
              placeholder={t(s.fields.currency_placeholder)}
              value={sourceToken}
              items={sourceOptions}
              isItemDisabled={targetToken}
            />
          </div>
        </div>
      </FieldGroup>

      <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
        <Icon icon="arrow-down" />
      </div>

      <FieldGroup label={t(s.fields.receive)} labelColor={color}>
        <div className="tw-grid tw-gap-8 tw--mx-4tw-grid-cols-12">
          <div className="tw-col-span-8">
            <DummyField>
              <LoadableValue
                value={<>{weiToFixed(rateByPath, 8)}</>}
                loading={loading}
              />
            </DummyField>
          </div>
          <div className="tw-col-span-4">
            <FormSelect
              onChange={value => setTargetToken(value.key)}
              placeholder={t(s.fields.currency_placeholder)}
              value={targetToken}
              items={targetOptions}
              isItemDisabled={sourceToken}
            />
          </div>
        </div>
      </FieldGroup>

      <SendTxProgress {...tx} displayAbsolute={false} />

      <div className="tw-flex tw-flex-col lg:tw-flex-row lg:tw-justify-between lg:tw-items-center">
        <div className="tw-mb-4 lg:tw-mb-0">
          <AssetWalletBalance asset={sourceToken} />
        </div>
        <TradeButton
          text={t(s.buttons.submit)}
          onClick={() => send()}
          hideIt={disableNewTrades}
          disabled={
            disableNewTrades ||
            !isConnected ||
            tx.loading ||
            amount <= '0' ||
            rateByPath <= '0' ||
            targetToken === sourceToken
          }
          loading={tx.loading}
          textColor={color}
          tooltip={
            disableNewTrades ? (
              <div className="mw-tooltip">{disableNewTradesText}</div>
            ) : undefined
          }
        />
      </div>
    </>
  );
}
