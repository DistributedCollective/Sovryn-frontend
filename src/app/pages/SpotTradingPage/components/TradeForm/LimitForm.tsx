import React, { useMemo, useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { AmountInput } from 'app/components/Form/AmountInput';
import { Button } from '../Button';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { bignumber } from 'mathjs';
import { useWalletContext } from '@sovryn/react-wallet';
import { TradingTypes, ITradeFormProps, IApiLimitOrder } from '../../types';
import { OrderTypes } from 'app/components/OrderType/types';
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
import { useLimitOrder } from 'app/hooks/limitOrder/useLimitOrder';
import cn from 'classnames';
import { useSwapsExternal_getSwapExpectedReturn } from 'app/hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import { toWei } from 'web3-utils';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { actions } from '../../slice';
import { useDispatch } from 'react-redux';
import { Toast } from 'app/components/Toast';
import { TransactionDialog } from 'app/components/TransactionDialog';

export const LimitForm: React.FC<ITradeFormProps> = ({
  sourceToken,
  targetToken,
  tradeType,
  hidden,
}) => {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const { checkMaintenance, States } = useMaintenance();
  const spotLocked = checkMaintenance(States.SPOT_TRADES);
  const dispatch = useDispatch();

  const [tradeDialog, setTradeDialog] = useState(false);

  const [amount, setAmount] = useState<string>('');
  const [limitPrice, setLimitPrice] = useState<string>('');

  const [duration, setDuration] = useState<number>(0);

  const amountOut = useMemo(() => {
    if (!limitPrice || !amount || limitPrice === '0') return '0';

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
    if (!limitPrice || limitPrice === '0' || !marketPrice) return '';

    return bignumber(limitPrice)
      .div(weiToFixed(marketPrice, 6))
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

  const gasLimit = 340000;

  const validate = useMemo(() => {
    return (
      amount &&
      limitPrice &&
      bignumber(weiAmountOut).greaterThan(0) &&
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(
        maxMinusFee(balance, sourceToken, gasLimit),
      )
    );
  }, [amount, balance, limitPrice, sourceToken, weiAmount, weiAmountOut]);

  const onSuccess = (data, order: IApiLimitOrder) => {
    setTradeDialog(false);
    dispatch(actions.addPendingLimitOrders(order));

    Toast(
      'success',
      <div className="tw-flex">
        <p className="tw-mb-0 tw-mr-2">
          <Trans i18nKey={translations.transactionDialog.txStatus.complete} />
        </p>
      </div>,
    );
  };

  const onError = error => {
    setTradeDialog(false);
    console.log('error: ', error);
  };

  const { createOrder, ...tx } = useLimitOrder(
    sourceToken,
    targetToken,
    weiAmount,
    weiAmountOut,
    duration,
    onSuccess,
    onError,
  );

  return (
    <div className={cn({ 'tw-hidden': hidden })}>
      <TradeDialog
        onCloseModal={() => setTradeDialog(false)}
        isOpen={tradeDialog}
        tradeType={tradeType}
        orderType={OrderTypes.LIMIT}
        amount={amount}
        expectedReturn={stringToFixedPrecision(amountOut, 6)}
        targetToken={targetToken}
        sourceToken={sourceToken}
        limitPrice={limitPrice}
        duration={duration}
        submit={() => createOrder()}
      />

      <TransactionDialog tx={tx} />
      <div className="tw-mx-auto">
        <div className="tw-mb-2 tw-mt-2 tw-bg-gray-5 tw-py-2 tw-text-center tw-flex tw-items-center tw-justify-center tw-rounded-lg">
          <AvailableBalance
            className={styles['available-balance']}
            asset={sourceToken}
          />
        </div>

        <div className="tw-flex tw-items-center tw-justify-between tw-mt-5">
          <span className={styles.amountLabel + ' tw-mr-4'}>Amount:</span>
          <AmountInput
            value={amount}
            onChange={value => setAmount(value)}
            asset={sourceToken}
            hideAmountSelector
          />
        </div>

        <div className="tw-flex tw-relative tw-items-center tw-justify-between tw-mt-5">
          <span className={styles.amountLabel + ' tw-mr-4'}>
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
            />
          </div>

          {/* <div className="tw-text-sm tw-w-full tw-text-right tw-truncate tw-absolute tw-top-full tw-mt-1">
            1 <AssetRenderer asset={sourceToken} /> ={' '}
            {toNumberFormat(limitPrice, 6)}{' '}
            <AssetRenderer asset={targetToken} />
          </div> */}
        </div>

        {/* <div className="tw-mt-2">
          Market Price: 1 <AssetRenderer asset={sourceToken} /> ={' '}
          {weiToFixed(marketPrice, 6)} <AssetRenderer asset={targetToken} />
        </div> */}

        <Duration value={duration} onChange={value => setDuration(value)} />

        <div className="swap-form__amount">
          <div className="tw-flex tw-items-center tw-justify-between tw-px-6 tw-py-2 tw-w-full tw-border tw-border-gray-5 tw-rounded-lg">
            <span>
              {t(translations.spotTradingPage.tradeForm.amountReceived)}
            </span>
            <span>
              {stringToFixedPrecision(amountOut, 6)}{' '}
              <AssetRenderer asset={targetToken} />
            </span>
          </div>
          <div
            className={cn('tw-text-sm tw-text-right', {
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
          <Button
            text={t(
              tradeType === TradingTypes.BUY
                ? translations.spotTradingPage.tradeForm.buy_cta
                : translations.spotTradingPage.tradeForm.sell_cta,
            )}
            tradingType={tradeType}
            onClick={() => setTradeDialog(true)}
            disabled={!validate || !connected || spotLocked}
          />
        </div>
      )}
    </div>
  );
};
