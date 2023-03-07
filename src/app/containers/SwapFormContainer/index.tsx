import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { fromWei, weiToFixed } from 'utils/blockchain/math-helpers';
import { Asset } from 'types';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { SwapSelector } from './components/SwapSelector/Loadable';
import { AmountInput } from 'app/components/Form/AmountInput';
import { SlippageDialog } from 'app/pages/BuySovPage/components/BuyForm/Dialogs/SlippageDialog';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { BuyButton } from 'app/pages/BuySovPage/components/Button/buy';
import { SwapStatsPrices } from './components/SwapStatsPrices';
import { bignumber } from 'mathjs';
import { Input } from 'app/components/Form/Input';
import { ActionButton } from 'app/components/Form/ActionButton';
import { weiToNumberFormat } from 'utils/display-text/format';
import { AvailableBalance } from 'app/components/AvailableBalance';
import { Arbitrage } from 'app/components/Arbitrage/Arbitrage';
import { FormGroup } from 'app/components/Form/FormGroup';
import swapIcon from '../../../assets/images/swap/swap_horizontal.svg';
import settingIcon from 'assets/images/settings-blue.svg';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { useMaintenance } from 'app/hooks/useMaintenance';
import {
  currentChainId,
  discordInvite,
  graphWrapperUrl,
} from 'utils/classifiers';
import { useSwapsExternal_getSwapExpectedReturn } from 'app/hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import { IPromotionLinkState } from '../../components/Promotions/components/PromotionCard/types';
import styles from './index.module.scss';
import { useSwapNetwork_approveAndConvertByPath } from 'app/hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { useSwapNetwork_conversionPath } from 'app/hooks/swap-network/useSwapNetwork_conversionPath';
import { ReviewDialog } from './components/ReviewDialog';
import axios, { Canceler } from 'axios';
import { IAssets } from 'app/pages/LandingPage/components/CryptocurrencyPrices/types';
import { IPairsData } from 'types/trading-pairs';
import { useInterval } from 'app/hooks/useInterval';
import { getFavoriteList } from 'utils/helpers';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { useGetMaximumAssetPrice } from 'app/hooks/tutorial/useGetMaximumAssetPrice';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import { Tooltip } from '@blueprintjs/core';

const refreshInterval = 300000;

export const SwapFormContainer: React.FC = () => {
  const { t } = useTranslation();
  const isConnected = useCanInteract();
  const { checkMaintenance, States } = useMaintenance();
  const swapLocked = checkMaintenance(States.SWAP_TRADES);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [sourceToken, setSourceToken] = useState(Asset.RBTC);
  const [targetToken, setTargetToken] = useState(Asset.SOV);
  const [slippage, setSlippage] = useState(0.5);
  const weiAmount = useWeiAmount(amount);

  const [pairsLoading, setPairsLoading] = useState(false);
  const [pairsData, setPairsData] = useState<IPairsData>();
  const cancelAssetDataRequest = useRef<Canceler>();
  const cancelDataRequest = useRef<Canceler>();
  const cancelPairsDataRequest = useRef<Canceler>();
  const [assetData, setAssetData] = useState<IAssets>();
  const location = useLocation<IPromotionLinkState>();

  const getPairsData = useCallback(() => {
    setPairsLoading(true);
    cancelPairsDataRequest.current && cancelPairsDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(graphWrapperUrl[currentChainId] + 'cmc/summary', {
        cancelToken,
        params: {
          extra: true,
          stmp: Date.now(),
        },
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '30',
        },
      })
      .then(res => {
        setPairsData(res.data);
      })
      .catch(e => console.error(e))
      .finally(() => {
        setPairsLoading(false);
      });
  }, []);

  const getAssetData = useCallback(() => {
    cancelAssetDataRequest.current && cancelAssetDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(graphWrapperUrl[currentChainId] + 'cmc/asset', {
        params: {
          stmp: Date.now(),
        },
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '30',
        },
        cancelToken,
      })
      .then(res => {
        setAssetData(res.data);
      })
      .catch(e => console.error(e));
  }, []);

  useInterval(
    () => {
      getPairsData();
      getAssetData();
    },
    refreshInterval,
    { immediate: true },
  );

  const storageKey = useMemo(() => {
    if (location.pathname === '/swap') {
      return 'swap-asset';
    }
    return '';
  }, [location.pathname]);

  const [favList, setFavList] = useState(getFavoriteList(storageKey));

  const { value: rateByPath } = useSwapsExternal_getSwapExpectedReturn(
    sourceToken,
    targetToken,
    weiAmount,
  );

  const { minReturn } = useSlippage(rateByPath, slippage);

  const { value: path } = useSwapNetwork_conversionPath(
    AssetsDictionary.get(sourceToken).getTokenContractAddress(),
    AssetsDictionary.get(targetToken).getTokenContractAddress(),
  );

  const { send: sendPath, ...txPath } = useSwapNetwork_approveAndConvertByPath(
    path,
    weiAmount,
    minReturn,
  );

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

  const tx = txPath;
  const send = useCallback(() => sendPath(), [sendPath]);

  const setSwapTokens = useCallback((source: Asset, target: Asset) => {
    setSourceToken(source);
    setTargetToken(target);
  }, []);

  const handleFavClick = useCallback(
    asset => {
      const index = favList.findIndex((favorite: Asset) => favorite === asset);
      const list = [...favList];
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(asset);
      }
      setFavList(list);
    },
    [favList],
  );

  const { sourceTokenValue, targetTokenValue } = useGetMaximumAssetPrice(
    weiAmount,
    minReturn,
    sourceToken,
    targetToken,
    slippage,
  );

  return (
    <>
      <SlippageDialog
        isOpen={dialogOpen}
        amount={rateByPath}
        value={slippage}
        asset={targetToken}
        onClose={() => setDialogOpen(false)}
        onChange={setSlippage}
        dataActionId="swap-"
      />

      <div className="tw-bg-gray-3 tw-w-full tw-mb-10 tw-overflow-hidden">
        <div className={styles.statsContainer}>
          {pairsData && pairsData.pairs && assetData && (
            <SwapStatsPrices pairs={pairsData.pairs} assetData={assetData} />
          )}

          {pairsLoading && (
            <div className="tw-skeleton tw-w-full" key={'loading'}>
              {t(translations.topUpHistory.loading)}
            </div>
          )}
        </div>
      </div>

      <Arbitrage onClick={(source, target) => setSwapTokens(source, target)} />

      <div className={styles.swapFormContainer}>
        <div className={styles.swapForm}>
          <div className={styles.title}>{t(translations.swap.send)}</div>
          <div
            className={styles.currency}
            data-action-id="swap-send-swapAssetSelector"
          >
            {pairsData && assetData && (
              <SwapSelector
                pairs={pairsData.pairs}
                assetData={assetData}
                onChange={setSourceToken}
                selectedAsset={sourceToken}
                selectedReverse={targetToken}
                onChangeFavorite={handleFavClick}
                favList={favList}
                storageKey={storageKey}
                dataActionId="send"
              />
            )}
          </div>
          <div className={styles.availableBalance}>
            <AvailableBalance
              asset={sourceToken}
              dataActionId="swap-send-availableBalance"
            />
          </div>
          <FormGroup
            label={t(translations.swap.tradeAmount)}
            className="tw-mt-3"
          >
            <AmountInput
              value={amount}
              onChange={setAmount}
              asset={sourceToken}
              dataActionId="swap"
            />
          </FormGroup>
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
            className={styles.currency}
            data-action-id="swap-receive-swapAssetSelector"
          >
            {pairsData && assetData && targetToken && (
              <SwapSelector
                pairs={pairsData.pairs}
                assetData={assetData}
                onChange={setTargetToken}
                selectedAsset={targetToken}
                selectedReverse={sourceToken}
                onChangeFavorite={handleFavClick}
                favList={favList}
                storageKey={storageKey}
                dataActionId="receive"
              />
            )}
          </div>
          <div className={styles.availableBalance}>
            <AvailableBalance
              asset={targetToken}
              dataActionId="swap-receive-availableBalance"
            />
          </div>
          <FormGroup
            label={t(translations.swap.receiveAmount)}
            className="tw-mt-3"
          >
            <Input
              value={weiToFixed(rateByPath, 6)}
              onChange={value => setAmount(value)}
              readOnly={true}
              appendElem={<AssetRenderer asset={targetToken} />}
              dataActionId="swap-receive-amount"
            />
            <div className={styles.swapBtnHelper}>
              <div>{t(translations.swap.minimumReceived)}</div>
              <div>
                {weiToNumberFormat(minReturn, 6)}{' '}
                <AssetRenderer asset={targetToken} />
              </div>
            </div>

            <div className={styles.swapBtnHelper}>
              <div>{t(translations.swap.maximumPrice)}</div>
              <div>
                <Tooltip
                  content={
                    <AssetValue
                      value={targetTokenValue}
                      assetString={targetToken}
                      mode={AssetValueMode.auto}
                      maxDecimals={6}
                    />
                  }
                >
                  <AssetValue
                    value={sourceTokenValue}
                    assetString={sourceToken}
                    mode={AssetValueMode.auto}
                    maxDecimals={6}
                  />
                </Tooltip>
              </div>
            </div>
          </FormGroup>
        </div>
      </div>

      <div className={styles.swapBtnContainer}>
        <div className="tw-my-0 tw-text-secondary tw-text-xs tw-flex tw-justify-center">
          <ActionButton
            text={
              <div className="tw-flex">
                {t(translations.swap.advancedSettings)}
                <img
                  data-action-id="slippage-setting-button"
                  className="tw-ml-1"
                  src={settingIcon}
                  alt="setting"
                />
              </div>
            }
            onClick={() => setDialogOpen(true)}
            className="tw-border-none tw-ml-0 tw-p-0 tw-h-auto"
            textClassName="tw-text-xs tw-overflow-visible tw-text-secondary"
            disabled={
              tx.loading ||
              !isConnected ||
              (!validate && isConnected) ||
              swapLocked
            }
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
          onClick={() => setIsReviewDialogOpen(true)}
          text={t(translations.swap.cta)}
          dataActionId="swap-confirmButton"
        />
      </div>

      <TransactionDialog tx={tx} />

      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onConfirm={send}
        onClose={() => setIsReviewDialogOpen(!isReviewDialogOpen)}
        sourceToken={sourceToken}
        targetToken={targetToken}
        amount={amount}
        expectedReturn={rateByPath}
        amountReceived={minReturn}
      />
    </>
  );
};
