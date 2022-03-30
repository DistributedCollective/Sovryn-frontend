import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useWalletContext } from '@sovryn/react-wallet';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { bignumber } from 'mathjs';
import { AmountInput } from 'app/components/Form/AmountInput';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { FormGroup } from 'app/components/Form/FormGroup';
import { useMaintenance } from 'app/hooks/useMaintenance';
import settingIcon from 'assets/images/settings-blue.svg';
import { discordInvite, useTenderlySimulator } from 'utils/classifiers';
import { translations } from 'locales/i18n';
import { TradingPosition } from 'types/trading-position';
import styles from './index.module.scss';
import {
  TradingPairDictionary,
  TradingPairType,
} from 'utils/dictionaries/trading-pair-dictionary';
import { useTrading_resolvePairTokens } from 'app/hooks/trading/useTrading_resolvePairTokens';
import { AvailableBalance } from 'app/components/AvailableBalance';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { selectMarginTradePage } from '../../selectors';
import { actions } from '../../slice';
import { ActionButton } from 'app/components/Form/ActionButton';
import { ButtonTrade } from 'app/components/ButtonTrade';
import { LimitOrderSetting } from '../LimitOrder/LimitOrderSetting';
import { CollateralAssets } from '../CollateralAssets';
import { LeverageSelector } from '../LeverageSelector';
import { useGetEstimatedMarginDetails } from 'app/hooks/trading/useGetEstimatedMarginDetails';
import { TradeDialog } from '../TradeDialog';
import { LiquidationPrice } from '../LiquidationPrice';
import { useCurrentPositionPrice } from 'app/hooks/trading/useCurrentPositionPrice';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import { SlippageForm } from '../SlippageForm';
import { fromWei, toWei } from 'utils/blockchain/math-helpers';
import { OrderType } from 'app/components/OrderTypeTitle/types';
import { MARGIN_SLIPPAGE_DEFAULT } from '../../types';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { LoadableValue } from 'app/components/LoadableValue';
import { PricePrediction } from 'app/containers/MarginTradeForm/PricePrediction';
import { durationOptions } from 'app/pages/SpotTradingPage/components/LimitOrderSetting/Duration';
import { OrderTypeTitle } from 'app/components/OrderTypeTitle';
import { LimitTradeDialog } from '../LimitOrder/LimitTradeDialog';
import { useDenominateDollarToAssetAmount } from 'app/hooks/trading/useDenominateDollarToAssetAmount';
import { getPriceAmm } from 'utils/blockchain/requests/amm';
import { HelpBadge } from 'app/components/HelpBadge/HelpBadge';

interface ITradeFormProps {
  pairType: TradingPairType;
}
export const TradeForm: React.FC<ITradeFormProps> = ({ pairType }) => {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const { checkMaintenance, States } = useMaintenance();
  const openTradesLocked = checkMaintenance(States.OPEN_MARGIN_TRADES);
  const [openSlippage, setOpenSlippage] = useState(false);
  const [tradeAmount, setTradeAmount] = useState('');
  const [slippage, setSlippage] = useState(MARGIN_SLIPPAGE_DEFAULT);
  const weiAmount = useWeiAmount(tradeAmount);

  const [orderType, setOrderType] = useState(OrderType.MARKET);
  const [limitPrice, setLimitPrice] = useState('');
  const [openLimitSetting, setOpenLimitSetting] = useState(false);
  const [duration, setDuration] = useState(0);
  const durationLabel = useMemo(
    () => durationOptions.find(item => item.value === duration)?.text || '',
    [duration],
  );

  const { position, amount, collateral, leverage } = useSelector(
    selectMarginTradePage,
  );
  const dispatch = useDispatch();
  const pair = useMemo(() => TradingPairDictionary.get(pairType), [pairType]);
  const {
    loanToken,
    collateralToken,
    useLoanTokens,
  } = useTrading_resolvePairTokens(pair, position, collateral);
  const {
    value: estimations,
    loading: estimationsLoading,
  } = useGetEstimatedMarginDetails(
    loanToken,
    leverage,
    useLoanTokens ? amount : '0',
    useLoanTokens ? '0' : amount,
    collateralToken,
  );
  const { price, loading: loadingPrice } = useCurrentPositionPrice(
    loanToken,
    collateralToken,
    estimations.principal,
    position === TradingPosition.SHORT,
  );

  useEffect(() => {
    dispatch(actions.setAmount(weiAmount));
  }, [weiAmount, dispatch]);

  useEffect(() => {
    if (pair.canOpenLong && !pair.canOpenShort)
      dispatch(actions.submit(TradingPosition.LONG));
    if (!pair.canOpenLong && pair.canOpenShort)
      dispatch(actions.submit(TradingPosition.SHORT));
  }, [pair.canOpenLong, pair.canOpenShort, dispatch]);

  useEffect(() => {
    if (!pair.collaterals.includes(collateral)) {
      dispatch(actions.setCollateral(pair.collaterals[0]));
    }
    setTradeAmount('0');
  }, [pair.collaterals, collateral, dispatch]);

  const {
    value: tokenBalance,
    loading: tokenBalanceLoading,
  } = useAssetBalanceOf(collateral);

  useEffect(() => {
    if (pair && pair.leverage) {
      dispatch(actions.setLeverage(pair.leverage));
    }
  }, [dispatch, pair]);

  const validate = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(tokenBalance) &&
      (orderType !== OrderType.LIMIT || limitPrice)
    );
  }, [weiAmount, tokenBalance, orderType, limitPrice]);

  const [isTradingDialogOpen, setIsTradingDialogOpen] = useState(false);

  const handlePositionLong = useCallback(() => {
    dispatch(actions.submit(TradingPosition.LONG));
  }, [dispatch]);

  const handlePositionShort = useCallback(() => {
    dispatch(actions.submit(TradingPosition.SHORT));
  }, [dispatch]);

  const {
    value: minAmount,
    loading: minAmountLoading,
  } = useDenominateDollarToAssetAmount(collateral, toWei(200));

  const isMinAmountValid = useMemo(() => {
    if (bignumber(weiAmount).greaterThan(0)) {
      return bignumber(weiAmount).greaterThanOrEqualTo(minAmount);
    }
    return true;
  }, [minAmount, weiAmount]);

  const loadingState = useMemo(() => {
    return (
      estimationsLoading ||
      tokenBalanceLoading ||
      loadingPrice ||
      (orderType === OrderType.LIMIT && minAmountLoading)
    );
  }, [
    estimationsLoading,
    loadingPrice,
    minAmountLoading,
    orderType,
    tokenBalanceLoading,
  ]);

  const buttonDisabled = useMemo(
    () =>
      !validate ||
      !connected ||
      openTradesLocked ||
      loadingState ||
      (orderType === OrderType.LIMIT && !isMinAmountValid),
    [
      validate,
      connected,
      openTradesLocked,
      loadingState,
      orderType,
      isMinAmountValid,
    ],
  );

  useEffect(() => {
    getPriceAmm(pair.shortAsset, pair.longAsset, toWei('0.01'))
      .then(response => bignumber(response).mul(100))
      .then(fromWei)
      .then(setLimitPrice);
  }, [pair.longAsset, pair.shortAsset]);

  return (
    <>
      <div className="tw-trading-form-card tw-bg-black tw-rounded-3xl tw-p-4 tw-mx-auto xl:tw-mx-0 tw-relative">
        {!openTradesLocked && (
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-4 tw-mx-auto">
            {pair.canOpenLong && (
              <ButtonTrade
                text={t(translations.marginTradePage.tradeForm.buttons.long)}
                position={TradingPosition.LONG}
                onClick={handlePositionLong}
                className={classNames('tw-capitalize tw-h-8 tw-opacity-50', {
                  'tw-opacity-100': position === TradingPosition.LONG,
                })}
                data-action-id="margin-button-long"
              />
            )}
            {pair.canOpenShort && (
              <ButtonTrade
                text={t(translations.marginTradePage.tradeForm.buttons.short)}
                position={TradingPosition.SHORT}
                onClick={handlePositionShort}
                className={classNames('tw-capitalize tw-h-8 tw-opacity-50', {
                  'tw-opacity-100': position === TradingPosition.SHORT,
                })}
                data-action-id="margin-button-short"
              />
            )}
          </div>
        )}
        <div className="tw-mx-auto tw-mt-3">
          <OrderTypeTitle
            value={orderType}
            onChange={setOrderType}
            dataActionId="margin"
          />
          <CollateralAssets
            value={collateral}
            onChange={value => dispatch(actions.setCollateral(value))}
            options={pair.collaterals}
          />
          <AvailableBalance
            asset={collateral}
            dataAttribute="margin-label-availableBalance"
          />
          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.amount)}
          >
            <AmountInput
              value={tradeAmount}
              onChange={setTradeAmount}
              asset={collateral}
              dataActionId="margin"
            />
          </FormGroup>

          {orderType === OrderType.LIMIT && (
            <>
              <div className="tw-flex tw-text-sm tw-relative tw-items-center tw-justify-between tw-mt-5">
                <span className={styles.amountLabel}>
                  <HelpBadge
                    tooltip={t(
                      translations.spotTradingPage.tradeForm.limitPriceTooltip,
                    )}
                  >
                    {t(translations.spotTradingPage.tradeForm.limitPrice)}
                  </HelpBadge>
                </span>
                <div className="tw-flex tw-items-center">
                  <div className="tw-mr-2">
                    <AssetRenderer asset={pair.longAsset} />
                  </div>
                  <AmountInput
                    value={limitPrice}
                    decimalPrecision={8}
                    onChange={setLimitPrice}
                    hideAmountSelector
                    dataActionId="margin-limit-limitPrice"
                  />
                </div>
              </div>
              {!isMinAmountValid && (
                <ErrorBadge
                  content={t(
                    translations.spotTradingPage.tradeForm.errors.minAmount,
                  )}
                />
              )}
              <div className="tw-flex tw-text-secondary tw-text-xs tw-relative tw-items-center tw-justify-between tw-mt-2">
                <span className={'tw-mr-1'}>
                  {t(translations.spotTradingPage.limitOrderSetting.duration)}
                </span>
                <span
                  className="tw-flex tw-cursor-pointer"
                  onClick={() => setOpenLimitSetting(true)}
                >
                  {t(durationLabel, { count: duration })}
                  <img className="tw-ml-1" src={settingIcon} alt="setting" />
                </span>
              </div>
            </>
          )}

          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.leverage)}
            className={classNames(
              'tw-mb-4 tw-mt-6 tw-w-full tw-bg-gray-4 tw-rounded-md tw-px-4 tw-py-2',
              {
                'tw-flex tw-pb-0': pair && pair.leverage,
              },
            )}
          >
            {pair && pair.leverage ? (
              <span className="tw-ml-1">{pair.leverage}x</span>
            ) : (
              <LeverageSelector
                value={leverage}
                onChange={value => dispatch(actions.setLeverage(value))}
              />
            )}
          </FormGroup>

          {!openTradesLocked && (
            <>
              <LabelValuePair
                label={t(translations.marginTradeForm.fields.esEntryPrice)}
                value={
                  <>
                    {useTenderlySimulator ? (
                      <>
                        <LoadableValue
                          loading={loadingPrice}
                          value={toNumberFormat(price, 2)}
                          tooltip={toNumberFormat(price, 18)}
                        />{' '}
                        <AssetRenderer asset={pair.longAsset} />
                      </>
                    ) : (
                      <>
                        <PricePrediction
                          position={position}
                          leverage={leverage}
                          loanToken={loanToken}
                          collateralToken={collateralToken}
                          useLoanTokens={useLoanTokens}
                          weiAmount={amount}
                        />{' '}
                        <AssetRenderer asset={pair.longAsset} />
                      </>
                    )}
                  </>
                }
              />
              <LabelValuePair
                label={t(
                  translations.marginTradeForm.fields.esLiquidationPrice,
                )}
                value={
                  <>
                    <LiquidationPrice
                      asset={pair.shortAsset}
                      assetLong={pair.longAsset}
                      leverage={leverage}
                      position={position}
                    />{' '}
                    <AssetRenderer asset={pair.longAsset} />
                  </>
                }
              />
              <LabelValuePair
                label={t(translations.marginTradeForm.fields.interestAPR)}
                value={<>{weiToNumberFormat(estimations.interestRate, 2)} %</>}
              />

              {orderType === OrderType.MARKET && (
                <div className="tw-mb-4 tw-text-secondary tw-text-xs tw-flex">
                  <ActionButton
                    text={
                      <div className="tw-flex">
                        {t(
                          translations.marginTradeForm.fields.slippageSettings,
                        )}
                        <img
                          className="tw-ml-1"
                          src={settingIcon}
                          alt="setting"
                        />
                      </div>
                    }
                    onClick={() => setOpenSlippage(true)}
                    className="tw-border-none tw-ml-0 tw-p-0 tw-h-auto"
                    textClassName="tw-text-xs tw-overflow-visible tw-text-secondary"
                    data-action-id="margin-slippage-setting"
                  />
                </div>
              )}

              <ButtonTrade
                text={
                  position === TradingPosition.LONG ? (
                    <>
                      {t(
                        translations.marginTradePage.tradeForm.placePosition
                          .placeLong,
                      )}{' '}
                      {orderType === OrderType.MARKET
                        ? t(translations.marginTradePage.tradeForm.market)
                        : t(translations.marginTradePage.tradeForm.limit)}
                    </>
                  ) : (
                    <>
                      {t(
                        translations.marginTradePage.tradeForm.placePosition
                          .placeShort,
                      )}{' '}
                      {orderType === OrderType.MARKET
                        ? t(translations.marginTradePage.tradeForm.market)
                        : t(translations.marginTradePage.tradeForm.limit)}
                    </>
                  )
                }
                position={position}
                onClick={() => setIsTradingDialogOpen(true)}
                disabled={buttonDisabled}
                loading={loadingState}
                data-action-id="margin-reviewTransaction-button-placePosition"
              />
            </>
          )}

          {openTradesLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.openMarginTrades}
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

        {openLimitSetting && (
          <LimitOrderSetting
            onClose={() => setOpenLimitSetting(false)}
            duration={duration}
            onChangeDuration={setDuration}
          />
        )}

        {openSlippage && (
          <SlippageForm
            onClose={() => setOpenSlippage(false)}
            amount={toWei(price)}
            value={slippage}
            asset={collateralToken}
            onChange={setSlippage}
            isTrade={true}
          />
        )}
        <TradeDialog
          onCloseModal={() => setIsTradingDialogOpen(false)}
          isOpen={isTradingDialogOpen && orderType === OrderType.MARKET}
          slippage={slippage}
          orderType={orderType}
          estimations={estimations}
        />
        <LimitTradeDialog
          onCloseModal={() => setIsTradingDialogOpen(false)}
          isOpen={isTradingDialogOpen && orderType === OrderType.LIMIT}
          orderType={orderType}
          minEntryPrice={limitPrice}
          duration={duration}
        />
      </div>
    </>
  );
};

interface ILabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

export const LabelValuePair: React.FC<ILabelValuePairProps> = ({
  label,
  value,
  className,
}) => (
  <div
    className={classNames(
      'tw-flex tw-text-xs tw-flex-row tw-flex-wrap tw-justify-between tw-space-x-4 tw-mb-2',
      className,
    )}
  >
    <div className="tw-truncate ">{label}</div>
    <div className="tw-truncate tw-text-right">{value}</div>
  </div>
);
