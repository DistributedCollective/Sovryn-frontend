import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { fromWei, weiToFixed } from '../../../utils/blockchain/math-helpers';
import { Asset } from '../../../types';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
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
import { bignumber } from 'mathjs';
import { Input } from 'app/components/Form/Input';
import { AvailableBalance } from '../../components/AvailableBalance';
import { Arbitrage } from '../../components/Arbitrage/Arbitrage';
import { useAccount } from '../../hooks/useAccount';
import { getTokenContractName } from '../../../utils/blockchain/contract-helpers';
import { Sovryn } from '../../../utils/sovryn';
import { contractReader } from '../../../utils/sovryn/contract-reader';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';
import { useSwapsExternal_getSwapExpectedReturn } from '../../hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import { useSwapsExternal_approveAndSwapExternal } from '../../hooks/swap-network/useSwapsExternal_approveAndSwapExternal';
import { IPromotionLinkState } from 'app/pages/LandingPage/components/Promotions/components/PromotionCard/types';

import styles from './index.module.scss';
import { useSwapNetwork_approveAndConvertByPath } from '../../hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { useSwapNetwork_conversionPath } from '../../hooks/swap-network/useSwapNetwork_conversionPath';

const s = translations.swapTradeForm;

interface Option {
  key: Asset;
  label: string;
}

const xusdExcludes = [Asset.USDT, Asset.DOC];

export function SwapFormContainer() {
  const { t } = useTranslation();
  const isConnected = useCanInteract();
  const { checkMaintenance, States } = useMaintenance();
  const swapLocked = checkMaintenance(States.SWAP_TRADES);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState('');
  const [sourceToken, setSourceToken] = useState(Asset.RBTC);
  const [targetToken, setTargetToken] = useState(Asset.SOV);
  const [sourceOptions, setSourceOptions] = useState<any[]>([]);
  const [targetOptions, setTargetOptions] = useState<any[]>([]);
  const [slippage, setSlippage] = useState(0.5);
  const account = useAccount();
  const weiAmount = useWeiAmount(amount);
  const { value: tokens } = useCacheCallWithValue<string[]>(
    'converterRegistry',
    'getConvertibleTokens',
    [],
  );
  const [tokenBalance, setTokenBalance] = useState<any[]>([]);

  useEffect(() => {
    async function getOptions() {
      try {
        Promise.all(
          tokens.map(async item => {
            const asset = AssetsDictionary.getByTokenContractAddress(item);
            if (!asset || !asset.hasAMM) {
              return null;
            }
            let token: string = '';
            if (account) {
              if (asset.asset === Asset.RBTC) {
                token = await Sovryn.getWeb3().eth.getBalance(account);
              } else {
                token = await contractReader.call(
                  getTokenContractName(asset.asset),
                  'balanceOf',
                  [account],
                );
              }
            }
            return {
              key: asset.asset,
              label: asset.symbol,
              value: token,
            };
          }),
        ).then(result => {
          setTokenBalance(result.filter(item => item !== null) as Option[]);
        });
      } catch (e) {
        console.error(e);
      }
    }
    if (tokens.length > 0) getOptions();
  }, [account, tokens]);

  useEffect(() => {
    const newOptions = tokenBalance;
    if (newOptions) {
      setSourceOptions(newOptions);
    }

    if (
      !newOptions.find(item => item.key === sourceToken) &&
      newOptions.length
    ) {
      setSourceToken(newOptions[0].key);
    }
  }, [tokens, targetToken, sourceToken, tokenBalance]);

  useEffect(() => {
    const newOptions = tokenBalance;

    if (newOptions) {
      const filteredOptions = newOptions.filter(option => {
        if (sourceToken === Asset.XUSD && xusdExcludes.includes(option.key))
          return false;
        if (xusdExcludes.includes(sourceToken) && option.key === Asset.XUSD)
          return false;
        return option.key !== sourceToken;
      });
      if (filteredOptions.length > 0) setTargetOptions(filteredOptions);
    }

    let defaultTo: Asset | null = null;
    if (sourceToken === targetToken) {
      switch (targetToken) {
        case Asset.RBTC: {
          defaultTo = Asset.SOV;
          break;
        }
        case Asset.SOV:
        default: {
          defaultTo = Asset.RBTC;
          break;
        }
      }
    }

    if (defaultTo && newOptions.find(item => item.key === defaultTo)) {
      setTargetToken(defaultTo);
    } else if (
      //default to RBTC if invalid XUSD pair used
      ((sourceToken === Asset.XUSD && xusdExcludes.includes(targetToken)) ||
        (xusdExcludes.includes(sourceToken) && targetToken === Asset.XUSD)) &&
      newOptions.find(item => item.key === Asset.RBTC)
    ) {
      setTargetToken(Asset.RBTC);
    } else if (
      !newOptions.find(item => item.key === targetToken) &&
      newOptions.length
    ) {
      setTargetToken(newOptions[0].key);
    }
  }, [tokens, sourceToken, targetToken, tokenBalance]);

  const { value: rateByPath } = useSwapsExternal_getSwapExpectedReturn(
    sourceToken,
    targetToken,
    weiAmount,
  );

  const { minReturn } = useSlippage(rateByPath, slippage);

  const { value: path } = useSwapNetwork_conversionPath(
    tokenAddress(sourceToken),
    tokenAddress(targetToken),
  );

  const { send: sendPath, ...txPath } = useSwapNetwork_approveAndConvertByPath(
    path,
    weiAmount,
    minReturn,
  );

  const {
    send: sendExternal,
    ...txExternal
  } = useSwapsExternal_approveAndSwapExternal(
    sourceToken,
    targetToken,
    account,
    account,
    weiAmount,
    '0',
    minReturn,
    '0x',
  );

  const location = useLocation<IPromotionLinkState>();
  const history = useHistory<IPromotionLinkState>();

  useEffect(() => {
    if (location.state?.asset) {
      const item = tokenBalance.find(
        item => item.key === location.state?.asset,
      );
      if (item) {
        setSourceToken(item.key);
      }
    }
    if (location.state?.target) {
      const item = tokenBalance.find(
        item => item.key === location.state?.target,
      );
      if (item) {
        setTargetToken(item.key);
        history.replace(location.pathname);
      }
    }
  }, [tokens, tokenBalance, location.state, location.pathname, history]);

  const onSwapAssert = () => {
    const _sourceToken = sourceToken;
    setSourceToken(targetToken);
    setTargetToken(_sourceToken);
    setAmount(fromWei(rateByPath));
  };

  const validate = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(minReturn).greaterThan(0) &&
      targetToken !== sourceToken
    );
  }, [targetToken, sourceToken, minReturn, weiAmount]);

  const tx = useMemo(
    () =>
      targetToken === Asset.RBTC ||
      [targetToken, sourceToken].includes(Asset.RIF)
        ? txPath
        : txExternal,
    [targetToken, sourceToken, txExternal, txPath],
  );

  const send = useCallback(
    () =>
      targetToken === Asset.RBTC ||
      [targetToken, sourceToken].includes(Asset.RIF)
        ? sendPath()
        : sendExternal(),
    [targetToken, sourceToken, sendPath, sendExternal],
  );

  return (
    <>
      <SlippageDialog
        isOpen={dialogOpen}
        amount={rateByPath}
        value={slippage}
        asset={targetToken}
        onClose={() => setDialogOpen(false)}
        onChange={value => setSlippage(value)}
        dataActionId="swap-"
      />

      <Arbitrage />

      <div className={styles.swapFormContainer}>
        <div className={styles.swapForm}>
          <div className={styles.title}>{t(translations.swap.send)}</div>
          <div
            className={styles.currency}
            data-action-id="swap-send-swapAssetSelector"
          >
            <SwapAssetSelector
              value={sourceToken}
              items={sourceOptions}
              placeholder={t(s.fields.currency_placeholder)}
              onChange={value => setSourceToken(value.key)}
            />
          </div>
          <div className={styles.availableBalance}>
            <AvailableBalance
              asset={sourceToken}
              dataAttribute="swap-send-availableBalance"
            />
          </div>
          <div className={styles.amount}>
            <AmountInput
              value={amount}
              onChange={value => setAmount(value)}
              asset={sourceToken}
              dataActionId="swap-send-amountInput"
            />
          </div>
        </div>
        <div className={styles.swapRevertWrapper}>
          <div
            className={styles.swapRevert}
            style={{ backgroundImage: `url(${swapIcon})` }}
            onClick={onSwapAssert}
            data-action-id="swap-button-swapRevert"
          />
        </div>
        <div className={styles.swapForm}>
          <div className={styles.title}>{t(translations.swap.receive)}</div>
          <div
            data-action-id="swap-receive-swapAssetSelector"
            className={styles.currency}
          >
            <SwapAssetSelector
              value={targetToken}
              items={targetOptions}
              placeholder={t(s.fields.currency_placeholder)}
              onChange={value => setTargetToken(value.key)}
            />
          </div>
          <div className={styles.availableBalance}>
            <AvailableBalance
              asset={targetToken}
              dataAttribute="swap-receive-availableBalance"
            />
          </div>
          <div className={styles.amount}>
            <Input
              value={weiToFixed(rateByPath, 6)}
              onChange={value => setAmount(value)}
              readOnly={true}
              appendElem={<AssetRenderer asset={targetToken} />}
              dataActionId="swap-receive-amount"
            />
          </div>
        </div>
      </div>

      <div className={styles.swapBtnContainer}>
        <div className={styles.swapBtnHelper}>
          <span>
            {t(translations.swap.minimumReceived)}{' '}
            {weiToNumberFormat(minReturn, 6)}
          </span>
          <img
            src={settingIcon}
            alt="settings"
            data-action-id="swap-receive-availableBalance"
            onClick={() => setDialogOpen(true)}
          />
        </div>
        {swapLocked && (
          <ErrorBadge
            content={
              <Trans
                i18nKey={translations.maintenance.swapTrades}
                components={[
                  <a
                    href={discordInvite}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                  >
                    x
                  </a>,
                ]}
              />
            }
          />
        )}
        <BuyButton
          disabled={
            tx.loading ||
            !isConnected ||
            (!validate && isConnected) ||
            swapLocked
          }
          onClick={send}
          text={t(translations.swap.cta)}
          dataActionId="swap-confirmButton"
        />
      </div>

      <TxDialog tx={tx} />
    </>
  );
}

function tokenAddress(asset: Asset) {
  return AssetsDictionary.get(asset).getTokenContractAddress();
}
