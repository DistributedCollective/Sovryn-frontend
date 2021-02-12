/**
 *
 * SwapFormContainer
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { weiTo18, weiToFixed } from '../../../utils/blockchain/math-helpers';
import { Asset } from '../../../types/asset';
import { useWeiAmount } from '../../hooks/useWeiAmount';
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
import { disableNewTrades } from '../../../utils/classifiers';
import { SwapSlippageModal } from './components/SwapSlippageModal';
import { SwapAssetSelector } from './components/SwapAssetSelector/Loadable';
import { AmountField } from './components/SwapAmountField';
import swapIcon from '../../../assets/images/swap/ic_swap.svg';
import settingIcon from '../../../assets/images/swap/ic_setting.svg';

const s = translations.swapTradeForm;

function tokenAddress(asset: Asset) {
  return AssetsDictionary.get(asset).getTokenContractAddress();
}

interface Option {
  key: Asset;
  label: string;
}

export function SwapFormContainer() {
  const { t } = useTranslation();
  const isConnected = useCanInteract();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
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

  const onSwapAssert = () => {
    const _sourceToken = sourceToken;
    setSourceToken(targetToken);
    setTargetToken(_sourceToken);
  };

  const onSwap = () => {
    send();
  };

  return (
    <>
      {dialogOpen && (
        <SwapSlippageModal
          isOpen={dialogOpen}
          minReceivedAmount={weiToFixed(rateByPath, 8)}
          receivedToken={targetToken}
          onClose={() => setDialogOpen(false)}
          onConfirm={() => setDialogOpen(false)}
        />
      )}
      <div className="swap-form-container position-relative">
        <div className="d-flex justify-content-center">
          <div className="swap-form swap-form-send">
            <div className="swap-form__title">Send</div>
            <div className="swap-form__currency">
              <SwapAssetSelector
                value={sourceToken}
                items={sourceOptions}
                placeholder={t(s.fields.currency_placeholder)}
                onChange={value => setSourceToken(value.key)}
              />
            </div>
            <div className="swap-form__available-balance">
              <AssetWalletBalance asset={sourceToken} />
            </div>
            <div className="swap-form__amount">
              <AmountField
                value={amount}
                isLight
                onChange={value => setAmount(value)}
                onMaxClicked={() =>
                  setAmount(weiTo18(maxMinusFee(tokenBalance, sourceToken)))
                }
                rightElement={
                  <div className="swap-form__amount-type">{sourceToken}</div>
                }
              />
            </div>
          </div>
          <div className="swap-revert-wrapper">
            <div
              className="swap-revert"
              style={{ backgroundImage: `url(${swapIcon})` }}
              onClick={onSwapAssert}
            />
          </div>
          <div className="swap-form swap-form-receive">
            <div className="swap-form__title">Receive</div>
            <div className="swap-form__currency">
              <SwapAssetSelector
                value={targetToken}
                items={targetOptions}
                placeholder={t(s.fields.currency_placeholder)}
                onChange={value => setTargetToken(value.key)}
              />
            </div>
            <div className="swap-form__available-balance">
              <AssetWalletBalance asset={targetToken} />
            </div>
            <div className="swap-form__amount">
              <AmountField
                value={weiToFixed(rateByPath, 8)}
                onChange={value => setAmount(value)}
                rightElement={
                  <div className="swap-form__amount-type">{targetToken}</div>
                }
              />
            </div>
          </div>
        </div>
        <SendTxProgress {...tx} displayAbsolute={false} />

        <div className="swap-btn-container">
          <div className="swap-btn-helper">
            <span>Maximum Received: 0.02931216</span>
            <span>
              <img
                src={settingIcon}
                alt="settings"
                onClick={() => setDialogOpen(true)}
              />
            </span>
          </div>
          <button
            type="button"
            className="swap-btn"
            disabled={
              disableNewTrades ||
              !isConnected ||
              tx.loading ||
              amount <= '0' ||
              rateByPath <= '0' ||
              targetToken === sourceToken
            }
            onClick={() => onSwap()}
          >
            SWAP
          </button>
        </div>
      </div>
    </>
  );
}
