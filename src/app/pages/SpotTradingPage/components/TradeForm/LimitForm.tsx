import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { AmountInput } from 'app/components/Form/AmountInput';
import { ButtonTrade } from 'app/components/ButtonTrade';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { bignumber } from 'mathjs';
import { useWalletContext } from '@sovryn/react-wallet';
import { TradingTypes, ITradeFormProps, IApiLimitOrder } from '../../types';
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
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { actions } from '../../slice';
import { useDispatch } from 'react-redux';
import { Toast } from 'app/components/Toast';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { TxStatus } from 'store/global/transactions-store/types';
import { LimitResultDialog } from './LimitResultDialog';
import { gasLimit } from 'utils/classifiers';

export const LimitForm: React.FC<ITradeFormProps> = ({
  sourceToken,
  targetToken,
  tradeType,
  hidden,
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

  const [duration, setDuration] = useState(0);

  const amountOut = useMemo(() => {
    if (!limitPrice || !amount || limitPrice === '0') {
      return '0';
    }

    return bignumber(amount || '0')
      .times(limitPrice)
      .toString();
  }, [limitPrice, amount]);

  const weiAmount = useWeiAmount(amount);
  const weiAmountOut = useWeiAmount(amountOut);

  const { value: balance } = useAssetBalanceOf(sourceToken);
  const { value: marketPrice } = useSwapsExternal_getSwapExpectedReturn(
    sourceToken,
    targetToken,
    toWei('1'),
  );

  const limitMarketChange = useMemo(() => {
    if (!limitPrice || limitPrice === '0' || !marketPrice) {
      return '';
    }

    return bignumber(limitPrice)
      .div(marketPrice)
      .mul(100)
      .minus(100)
      .toNumber();
  }, [limitPrice, marketPrice]);

  useEffect(() => {
    if (
      marketPrice !== '0' &&
      (limitPrice === '' || stringToFixedPrecision(limitPrice, 0) === '0')
    ) {
      setLimitPrice(weiToFixed(marketPrice, 6));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketPrice]);

  useEffect(() => {
    setLimitPrice('');
  }, [sourceToken, targetToken]);

  const validate = useMemo(() => {
    return (
      amount &&
      limitPrice &&
      bignumber(weiAmountOut).greaterThan(0) &&
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(
        maxMinusFee(balance, sourceToken, gasLimit.trade),
      )
    );
  }, [amount, balance, limitPrice, sourceToken, weiAmount, weiAmountOut]);

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
    (order: IApiLimitOrder, data) => {
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
        expectedReturn={stringToFixedPrecision(amountOut, 6)}
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
        expectedReturn={stringToFixedPrecision(amountOut, 6)}
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
            onChange={setAmount}
            asset={sourceToken}
            hideAmountSelector
            dataActionId="spot-limit-amountInput"
          />
        </div>

        <div className="tw-flex tw-relative tw-items-center tw-justify-between tw-mt-5">
          <span className={styles.amountLabel}>
            {t(translations.spotTradingPage.tradeForm.limitPrice)}
          </span>
          <div className="tw-flex tw-items-center">
            <div className="tw-mr-2">
              <AssetRenderer asset={targetToken} />
            </div>
            <AmountInput
              value={stringToFixedPrecision(limitPrice, 6)}
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
              {stringToFixedPrecision(amountOut, 6)}{' '}
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
