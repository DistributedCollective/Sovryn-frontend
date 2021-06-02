/**
 *
 * SwapFormContainer
 *
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { fromWei, weiToFixed } from '../../../utils/blockchain/math-helpers';
import { Asset } from '../../../types';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { useSwapNetwork_conversionPath } from '../../hooks/swap-network/useSwapNetwork_conversionPath';
import { useSwapNetwork_rateByPath } from '../../hooks/swap-network/useSwapNetwork_rateByPath';
import { useSwapNetwork_approveAndConvertByPath } from '../../hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { useCanInteract } from '../../hooks/useCanInteract';
import { SwapAssetSelector } from './components/SwapAssetSelector/Loadable';
import { AmountInput } from 'app/components/Form/AmountInput';
import swapIcon from '../../../assets/images/swap/swap_horizontal.svg';
import settingIcon from '../../../assets/images/swap/ic_setting.svg';
import { SlippageDialog } from 'app/pages/BuySovPage/components/BuyForm/Dialogs/SlippageDialog';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { weiToNumberFormat } from 'utils/display-text/format';
import { BuyButton } from 'app/pages/BuySovPage/components/Button/buy';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { useWalletContext } from '@sovryn/react-wallet';
import { bignumber } from 'mathjs';
import { Input } from 'app/components/Form/Input';
import { AvailableBalance } from '../../components/AvailableBalance';

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
  const { connect } = useWalletContext();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState('');
  const [sourceToken, setSourceToken] = useState(Asset.RBTC);
  const [targetToken, setTargetToken] = useState(Asset.SOV);
  const [sourceOptions, setSourceOptions] = useState<any[]>([]);
  const [targetOptions, setTargetOptions] = useState<any[]>([]);
  const [slippage, setSlippage] = useState(0.5);

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
    setTargetOptions(newOptions.filter(option => option.key !== sourceToken));

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

  const { value: rateByPath } = useSwapNetwork_rateByPath(path, weiAmount);

  const { minReturn } = useSlippage(rateByPath, slippage);

  const { send, ...tx } = useSwapNetwork_approveAndConvertByPath(
    path,
    weiAmount,
    minReturn,
  );

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
    setAmount(fromWei(rateByPath));
  };

  const onSwap = () => {
    if (isConnected) send();
    else connect();
  };

  const validate = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(minReturn).greaterThan(0) &&
      targetToken !== sourceToken
    );
  }, [targetToken, sourceToken, minReturn, weiAmount]);

  return (
    <>
      {dialogOpen && (
        <SlippageDialog
          isOpen={dialogOpen}
          amount={rateByPath}
          value={slippage}
          asset={targetToken}
          onClose={() => setDialogOpen(false)}
          onChange={value => setSlippage(value)}
        />
      )}

      <div className="swap-form-container">
        <div className="swap-form swap-form-send">
          <div className="swap-form__title">{t(translations.swap.send)}</div>
          <div className="swap-form__currency">
            <SwapAssetSelector
              value={sourceToken}
              items={sourceOptions}
              placeholder={t(s.fields.currency_placeholder)}
              onChange={value => setSourceToken(value.key)}
            />
          </div>
          <div className="swap-form__available-balance">
            <AvailableBalance asset={sourceToken} />
          </div>
          <div className="swap-form__amount">
            <AmountInput
              value={amount}
              onChange={value => setAmount(value)}
              asset={sourceToken}
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
          <div className="swap-form__title">{t(translations.swap.receive)}</div>
          <div className="swap-form__currency">
            <SwapAssetSelector
              value={targetToken}
              items={targetOptions}
              placeholder={t(s.fields.currency_placeholder)}
              onChange={value => setTargetToken(value.key)}
            />
          </div>
          <div className="swap-form__available-balance">
            <AvailableBalance asset={targetToken} />
          </div>
          <div className="swap-form__amount">
            <Input
              value={weiToFixed(rateByPath, 6)}
              onChange={value => setAmount(value)}
              readOnly={true}
              appendElem={<AssetRenderer asset={targetToken} />}
            />
          </div>
        </div>
      </div>

      <div className="swap-btn-container">
        <div className="swap-btn-helper tw-flex tw-items-center tw-justify-center tw-tracking-normal">
          <span>
            {t(translations.swap.minimumReceived)}{' '}
            {weiToNumberFormat(minReturn, 6)}
          </span>
          <img
            src={settingIcon}
            alt="settings"
            onClick={() => setDialogOpen(true)}
          />
        </div>

        <BuyButton
          disabled={tx.loading || (!validate && isConnected)}
          onClick={() => onSwap()}
          text={isConnected ? 'SWAP' : 'Engage Wallet'}
        />
      </div>

      <TxDialog tx={tx} />
    </>
  );
}
