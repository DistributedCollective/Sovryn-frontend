import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { AmountInput } from 'app/components/Form/AmountInput';
import { ButtonTrade } from 'app/components/ButtonTrade';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { bignumber } from 'mathjs';
import { useWalletContext } from '@sovryn/react-wallet';
import { TradingTypes, ITradeFormProps, ILimitOrder } from '../../types';
import { OrderType } from 'app/components/OrderTypeTitle/types';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { maxMinusFee } from 'utils/helpers';
import { stringToFixedPrecision } from 'utils/display-text/format';
import { AvailableBalance } from 'app/components/AvailableBalance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';
import styles from './index.module.scss';
import { Duration } from '../LimitOrderSetting/Duration';
import { TradeDialog } from '../TradeDialog';
import { OrderLabel } from '../OrderLabel';
import { useLimitOrder } from 'app/hooks/limitOrder/useLimitOrder';
import classNames from 'classnames';
import { useSwapsExternal_getSwapExpectedReturn } from 'app/hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import { toWei } from 'web3-utils';
import { fromWei, weiToFixed } from 'utils/blockchain/math-helpers';
import { actions } from '../../slice';
import { useDispatch } from 'react-redux';
import { Toast } from 'app/components/Toast';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { TxStatus } from 'store/global/transactions-store/types';
import { LimitResultDialog } from './LimitResultDialog';
import { gasLimit } from 'utils/classifiers';
import { formatNumber } from 'app/containers/StatsPage/utils';
import { useDenominateDollarToAssetAmount } from 'app/hooks/trading/useDenominateDollarToAssetAmount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { useDenominateAssetAmount } from 'app/hooks/trading/useDenominateAssetAmount';
import { Asset } from 'types';
import { getRelayerFee } from 'app/hooks/limitOrder/utils';

export const LimitForm: React.FC<ITradeFormProps> = ({
  sourceToken,
  targetToken,
  tradeType,
  hidden,
  pair,
}) => {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const { checkMaintenance, States } = useMaintenance();
  const spotLocked = checkMaintenance(States.SPOT_LIMIT);
  const dispatch = useDispatch();

  const [tradeDialog, setTradeDialog] = useState(false);

  const [orderStatus, setOrderStatus] = useState(TxStatus.NONE);
  const [txHash, setTxHash] = useState('');

  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');

  const { value: minSwapOrderTxFeeInRBTC } = useCacheCallWithValue(
    'settlement',
    'minSwapOrderTxFee',
    '0',
  );

  const { value: minSwapOrderTxFee } = useDenominateAssetAmount(
    Asset.RBTC,
    sourceToken,
    minSwapOrderTxFeeInRBTC,
  );

  const [duration, setDuration] = useState(0);

  const weiAmount = useWeiAmount(amount);

  const weiAmountOut = useMemo(() => {
    if (!limitPrice || !amount || limitPrice === '0') {
      return '0';
    }

    const relayerFee = getRelayerFee(minSwapOrderTxFee, weiAmount);
    const price =
      tradeType === TradingTypes.SELL
        ? limitPrice
        : bignumber(1).div(limitPrice || '0');
    return bignumber(weiAmount)
      .minus(relayerFee)
      .mul(price || '0')
      .toFixed(0);
  }, [amount, limitPrice, minSwapOrderTxFee, tradeType, weiAmount]);

  const { value: minAmount } = useDenominateDollarToAssetAmount(sourceToken);

  const { value: balance } = useAssetBalanceOf(sourceToken);
  const { value: marketPrice } = useSwapsExternal_getSwapExpectedReturn(
    pair[0],
    pair[1],
    toWei('1'),
  );

  const limitMarketChange = useMemo(() => {
    if (!limitPrice || limitPrice === '0' || !marketPrice) {
      return '';
    }

    return bignumber(limitPrice)
      .div(weiToFixed(marketPrice, 8))
      .mul(100)
      .minus(100)
      .toNumber();
  }, [limitPrice, marketPrice]);

  useEffect(() => {
    if (
      marketPrice !== '0' &&
      (limitPrice === '' || stringToFixedPrecision(limitPrice, 0) === '0')
    ) {
      setLimitPrice(weiToFixed(marketPrice, 8));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketPrice]);

  useEffect(() => {
    setAmount('');
  }, [sourceToken]);

  const isMinAmountValid = useMemo(() => {
    if (bignumber(weiAmount).greaterThan(0)) {
      return bignumber(weiAmount).greaterThanOrEqualTo(minAmount);
    }
    return true;
  }, [minAmount, weiAmount]);

  const validate = useMemo(() => {
    return (
      amount &&
      limitPrice &&
      bignumber(weiAmountOut).greaterThan(0) &&
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(
        maxMinusFee(balance, sourceToken, gasLimit.trade),
      ) &&
      isMinAmountValid
    );
  }, [
    amount,
    balance,
    isMinAmountValid,
    limitPrice,
    sourceToken,
    weiAmount,
    weiAmountOut,
  ]);

  const showToast = useCallback(
    (status: string) => {
      Toast(
        status,
        <div className="tw-flex tw-items-center">
          <p className="tw-mb-0 tw-mr-2">
            <Trans
              i18nKey={
                status === 'success'
                  ? translations.transactionDialog.txStatus.submit
                  : translations.transactionDialog.pendingUser.failed
              }
            />
          </p>
          <OrderLabel
            className="tw-ml-2 tw-font-normal"
            orderType={OrderType.LIMIT}
            tradeType={tradeType}
          />
          <div className="tw-ml-2">
            {stringToFixedPrecision(amount, 6)}{' '}
            <AssetRenderer asset={sourceToken} />
          </div>
        </div>,
      );
    },
    [amount, sourceToken, tradeType],
  );

  const onSuccess = useCallback(
    (order: ILimitOrder, data) => {
      setTxHash(data.hash);
      setOrderStatus(TxStatus.CONFIRMED);
      dispatch(actions.addPendingLimitOrders(order));
      showToast('success');
    },
    [dispatch, showToast],
  );

  const onError = () => {
    setOrderStatus(TxStatus.FAILED);
    showToast('error');
  };

  const onStart = () => {
    setTradeDialog(false);
    setOrderStatus(TxStatus.PENDING);
  };

  const { createOrder, ...tx } = useLimitOrder(
    sourceToken,
    targetToken,
    weiAmount,
    weiAmountOut,
    duration,
    onSuccess,
    onError,
    onStart,
  );

  const submit = useCallback(() => {
    setOrderStatus(TxStatus.NONE);
    setTxHash('');
    createOrder();
  }, [createOrder]);

  return (
    <div className={classNames({ 'tw-hidden': hidden })}>
      <TradeDialog
        onCloseModal={() => setTradeDialog(false)}
        isOpen={tradeDialog}
        tradeType={tradeType}
        orderType={OrderType.LIMIT}
        amount={amount}
        expectedReturn={stringToFixedPrecision(fromWei(weiAmountOut), 6)}
        targetToken={targetToken}
        sourceToken={sourceToken}
        limitPrice={limitPrice}
        duration={duration}
        submit={submit}
      />
      <TransactionDialog tx={tx} />
      <LimitResultDialog
        isOpen={orderStatus !== TxStatus.NONE}
        onClose={() => setOrderStatus(TxStatus.NONE)}
        status={orderStatus}
        tradeType={tradeType}
        amount={amount}
        targetToken={targetToken}
        sourceToken={sourceToken}
        limitPrice={limitPrice}
        txHash={txHash}
        pair={pair}
        expectedReturn={stringToFixedPrecision(fromWei(weiAmountOut), 6)}
      />
      <div className="tw-mx-auto">
        <div className="tw-mb-2 tw-mt-2 tw-bg-gray-5 tw-py-2 tw-text-center tw-flex tw-items-center tw-justify-center tw-rounded-lg">
          <AvailableBalance
            className="tw-mb-0 tw-justify-center"
            asset={sourceToken}
          />
        </div>
        <div className="tw-flex tw-items-center tw-justify-between tw-mt-5">
          <span className={styles.amountLabel}>
            {t(translations.spotTradingPage.tradeForm.amount)}
          </span>
          <AmountInput
            value={amount}
            decimalPrecision={8}
            onChange={setAmount}
            asset={sourceToken}
            hideAmountSelector
            dataActionId="spot-limit-amountInput"
          />
        </div>
        {!isMinAmountValid && (
          <ErrorBadge
            content={t(translations.spotTradingPage.tradeForm.errors.minAmount)}
          />
        )}
        <div className="tw-flex tw-relative tw-items-center tw-justify-between tw-mt-5">
          <span className={styles.amountLabel}>
            {t(translations.spotTradingPage.tradeForm.limitPrice)}
          </span>
          <div className="tw-flex tw-items-center">
            <div className="tw-mr-2">
              <AssetRenderer asset={pair[1]} />
            </div>
            <AmountInput
              value={stringToFixedPrecision(limitPrice, 8)}
              decimalPrecision={8}
              onChange={setLimitPrice}
              hideAmountSelector
              dataActionId="spot-limit-limitPrice"
            />
          </div>
        </div>
        <Duration value={duration} onChange={setDuration} />
        <div className="swap-form__amount">
          <div className="tw-text-sm tw-flex tw-items-center tw-justify-between tw-px-3 tw-py-2 tw-w-full tw-border tw-border-gray-5 tw-rounded-lg">
            <span>
              {t(translations.spotTradingPage.tradeForm.amountReceived)}
            </span>
            <span>
              {formatNumber(Number(fromWei(weiAmountOut)), 6)}{' '}
              <AssetRenderer asset={targetToken} />
            </span>
          </div>
          <div
            className={classNames('tw-text-sm tw-text-right', {
              'tw-text-trade-short': limitMarketChange < 0,
              'tw-text-trade-long': limitMarketChange > 0,
              'tw-invisible':
                limitMarketChange === '' ||
                +stringToFixedPrecision(`${limitMarketChange}`, 2) === 0,
            })}
          >
            {t(translations.spotTradingPage.tradeForm.buy)}{' '}
            <AssetRenderer asset={targetToken} />{' '}
            {stringToFixedPrecision(`${limitMarketChange}`, 2)}%{' '}
            {limitMarketChange > 0
              ? t(translations.spotTradingPage.limitOrderSetting.aboveMarket)
              : t(translations.spotTradingPage.limitOrderSetting.belowMarket)}
          </div>
        </div>
      </div>
      <div className="tw-mt-12">
        {spotLocked && (
          <ErrorBadge
            content={
              <Trans
                i18nKey={translations.maintenance.spotTrades}
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
      </div>
      {!spotLocked && (
        <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-4 tw-mx-auto">
          <ButtonTrade
            text={t(
              tradeType === TradingTypes.BUY
                ? translations.spotTradingPage.tradeForm.buy_cta
                : translations.spotTradingPage.tradeForm.sell_cta,
            )}
            tradingType={tradeType}
            onClick={() => setTradeDialog(true)}
            disabled={!validate || !connected || spotLocked}
            data-action-id="spot-limit-submit"
          />
        </div>
      )}
    </div>
  );
};
