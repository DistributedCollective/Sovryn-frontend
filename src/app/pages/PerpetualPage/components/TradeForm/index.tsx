import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import settingImg from 'assets/images/settings-blue.svg';
import { discordInvite, gasLimit } from 'utils/classifiers';
import { translations } from '../../../../../locales/i18n';
import { TradingPosition } from '../../../../../types/trading-position';
import { PerpetualPairDictionary } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { LeverageSelector } from '../LeverageSelector';
import {
  weiToNumberFormat,
  toNumberFormat,
} from '../../../../../utils/display-text/format';
import classNames from 'classnames';
import { PerpetualTrade, PerpetualTradeType } from '../../types';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { Input } from '../../../../components/Input';
import { PopoverPosition, Tooltip } from '@blueprintjs/core';
import { AssetValue } from '../../../../components/AssetValue';
import { AssetValueMode } from '../../../../components/AssetValue/types';
import { LeverageViewer } from '../LeverageViewer';
import {
  getTradingFee,
  getQuote2CollateralFX,
  calculateApproxLiquidationPrice,
  calculateSlippagePrice,
  calculateLeverage,
  getMaxInitialLeverage,
  getMaximalTradeSizeInPerpetualWithCurrentMargin,
  getRequiredMarginCollateralWithGasFees,
  getPrice,
  getSignedMaxAbsPositionForTrader,
} from '../../utils/perpUtils';
import { shrinkToLot } from '../../utils/perpMath';
import {
  getSignedAmount,
  getTradeDirection,
  validatePositionChange,
} from '../../utils/contractUtils';
import { PerpetualQueriesContext } from '../../contexts/PerpetualQueriesContext';
import { usePerpetual_isTradingInMaintenance } from '../../hooks/usePerpetual_isTradingInMaintenance';
import { numberFromWei, toWei } from 'utils/blockchain/math-helpers';
import { useSelector } from 'react-redux';
import { selectPerpetualPage } from '../../selectors';
import { getCollateralName } from '../../utils/renderUtils';
import { TxType } from '../../../../../store/global/transactions-store/types';

interface ITradeFormProps {
  trade: PerpetualTrade;
  isNewTrade?: boolean;
  disabled?: boolean;
  onChange: (trade: PerpetualTrade) => void;
  onSubmit: () => void;
  onOpenSlippage: () => void;
}

export const TradeForm: React.FC<ITradeFormProps> = ({
  trade,
  isNewTrade,
  disabled,
  onChange,
  onSubmit,
  onOpenSlippage,
}) => {
  const { t } = useTranslation();

  const inMaintenance = usePerpetual_isTradingInMaintenance();

  const { useMetaTransactions } = useSelector(selectPerpetualPage);

  const {
    ammState,
    traderState,
    perpetualParameters: perpParameters,
    liquidityPoolState: liqPoolState,
    averagePrice,
    lotSize,
    lotPrecision,
    availableBalance,
  } = useContext(PerpetualQueriesContext);

  const pair = useMemo(() => PerpetualPairDictionary.get(trade.pairType), [
    trade.pairType,
  ]);
  const collateralName = useMemo(() => getCollateralName(trade.collateral), [
    trade.collateral,
  ]);

  const maxTradeSize = useMemo(() => {
    let maxTradeSize;
    if (isNewTrade) {
      maxTradeSize = shrinkToLot(
        Math.abs(
          getSignedMaxAbsPositionForTrader(
            getTradeDirection(trade.position),
            numberFromWei(availableBalance),
            perpParameters,
            traderState,
            ammState,
            liqPoolState,
            trade.slippage,
          ),
        ),
        lotSize,
      );
    } else {
      maxTradeSize = shrinkToLot(
        Math.abs(
          getMaximalTradeSizeInPerpetualWithCurrentMargin(
            getTradeDirection(trade.position),
            perpParameters,
            traderState,
            ammState,
            liqPoolState,
          ),
        ),
        lotSize,
      );
    }

    return Number.isFinite(maxTradeSize) ? maxTradeSize : 0;
  }, [
    isNewTrade,
    trade.position,
    trade.slippage,
    availableBalance,
    perpParameters,
    traderState,
    ammState,
    liqPoolState,
    lotSize,
  ]);

  const [minLeverage, maxLeverage] = useMemo(() => {
    const amountChange = getSignedAmount(trade.position, trade.amount);
    const amountTarget = traderState.marginAccountPositionBC + amountChange;
    let possibleMargin =
      numberFromWei(availableBalance) +
      traderState.availableCashCC -
      getTradingFee(amountChange, perpParameters, ammState);
    if (useMetaTransactions) {
      possibleMargin -=
        gasLimit.deposit_collateral + gasLimit[TxType.PERPETUAL_TRADE];
    }

    const maxLeverage = getMaxInitialLeverage(amountTarget, perpParameters);
    const minLeverage = Math.min(
      maxLeverage,
      Math.max(
        pair.config.leverage.min,
        calculateLeverage(
          amountTarget,
          possibleMargin,
          traderState,
          ammState,
          perpParameters,
        ),
      ),
    );

    return [minLeverage, maxLeverage];
  }, [
    trade.position,
    trade.amount,
    pair,
    availableBalance,
    useMetaTransactions,
    traderState,
    perpParameters,
    ammState,
  ]);

  const [amount, setAmount] = useState(
    Math.abs(numberFromWei(trade.amount)).toFixed(lotPrecision),
  );

  useEffect(() => {
    if (amount > maxTradeSize) {
      setAmount(maxTradeSize);
    }
  }, [amount, maxTradeSize, trade.position]);

  const onChangeOrderAmount = useCallback(
    (amount: string) => {
      const roundedAmount = Number(
        shrinkToLot(
          Math.max(Math.min(Number(amount) || 0, maxTradeSize), 0),
          lotSize,
        ).toFixed(lotPrecision),
      );
      setAmount(amount);
      const amountChange = roundedAmount * getTradeDirection(trade.position);
      const targetAmount = traderState.marginAccountPositionBC + amountChange;

      let newTrade = { ...trade, amount: toWei(roundedAmount) };

      if (isNewTrade) {
        newTrade.leverage = Math.max(
          minLeverage,
          Math.min(maxLeverage, newTrade.leverage),
        );
      } else {
        newTrade.leverage = calculateLeverage(
          targetAmount,
          traderState.availableCashCC,
          traderState,
          ammState,
          perpParameters,
        );
      }

      onChange(newTrade);
    },
    [
      onChange,
      trade,
      lotSize,
      lotPrecision,
      maxTradeSize,
      minLeverage,
      maxLeverage,
      isNewTrade,
      traderState,
      ammState,
      perpParameters,
    ],
  );

  const onBlurOrderAmount = useCallback(() => {
    setAmount(numberFromWei(trade.amount).toFixed(lotPrecision));
  }, [lotPrecision, trade.amount]);

  const [limit, setLimit] = useState(trade.limit);
  const onChangeOrderLimit = useCallback(
    (limit: string) => {
      setLimit(limit);
      onChange({ ...trade, limit: toWei(limit) });
    },
    [onChange, trade],
  );

  const onChangeLeverage = useCallback(
    (leverage: number) => {
      onChange({ ...trade, leverage });
    },
    [onChange, trade],
  );

  const bindSelectPosition = useCallback(
    (position: TradingPosition) => () => onChange({ ...trade, position }),
    [trade, onChange],
  );

  const bindSelectTradeType = useCallback(
    (tradeType: PerpetualTradeType) => () => onChange({ ...trade, tradeType }),
    [trade, onChange],
  );

  const tradeButtonLabel = useMemo(() => {
    const i18nKey = {
      LONG_LIMIT: translations.perpetualPage.tradeForm.buttons.buyLimit,
      LONG_MARKET: translations.perpetualPage.tradeForm.buttons.buyMarket,
      SHORT_LIMIT: translations.perpetualPage.tradeForm.buttons.sellLimit,
      SHORT_MARKET: translations.perpetualPage.tradeForm.buttons.sellMarket,
    }[`${trade.position}_${trade.tradeType}`];

    return i18nKey && t(i18nKey);
  }, [t, trade.position, trade.tradeType]);

  const quoteToCollateralFactor = useMemo(
    () => getQuote2CollateralFX(ammState),
    [ammState],
  );

  const requiredCollateral = useMemo(() => {
    const amount = getSignedAmount(trade.position, trade.amount);
    return getRequiredMarginCollateralWithGasFees(
      trade.leverage,
      traderState.marginAccountPositionBC + amount,
      perpParameters,
      ammState,
      traderState,
      trade.slippage,
      useMetaTransactions,
    );
  }, [perpParameters, ammState, traderState, trade, useMetaTransactions]);

  const tradingFee = useMemo(
    () => getTradingFee(numberFromWei(trade.amount), perpParameters, ammState),
    [trade.amount, perpParameters, ammState],
  );

  const liquidationPrice = useMemo(
    () =>
      calculateApproxLiquidationPrice(
        traderState,
        ammState,
        perpParameters,
        Number(amount) * getTradeDirection(trade.position),
        requiredCollateral,
      ),
    [
      amount,
      trade.position,
      traderState,
      ammState,
      perpParameters,
      requiredCollateral,
    ],
  );

  const limitPrice = useMemo(
    () =>
      calculateSlippagePrice(
        averagePrice,
        trade.slippage,
        getTradeDirection(trade.position),
      ),
    [averagePrice, trade.slippage, trade.position],
  );

  const entryPrice = useMemo(
    () =>
      getPrice(
        getSignedAmount(trade.position, trade.amount),
        perpParameters,
        ammState,
      ),
    [trade.position, trade.amount, perpParameters, ammState],
  );

  const validation = useMemo(() => {
    const signedAmount = getSignedAmount(trade.position, trade.amount);
    const marginChange = isNewTrade ? requiredCollateral : 0;
    return signedAmount !== 0 || marginChange !== 0
      ? validatePositionChange(
          signedAmount,
          marginChange,
          trade.leverage,
          trade.slippage,
          numberFromWei(availableBalance),
          traderState,
          perpParameters,
          ammState,
          useMetaTransactions,
        )
      : undefined;
  }, [
    isNewTrade,
    trade,
    requiredCollateral,
    availableBalance,
    traderState,
    perpParameters,
    ammState,
    useMetaTransactions,
  ]);

  const buttonDisabled = useMemo(
    () =>
      disabled ||
      Number(amount) <= 0 ||
      (validation && !validation.valid && !validation.isWarning),
    [disabled, amount, validation],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onChange({ ...trade, entryPrice: averagePrice }), [
    averagePrice,
    onChange,
  ]);

  // clamp leverage
  useEffect(() => {
    if (isNewTrade) {
      const leverage = Math.max(
        minLeverage,
        Math.min(maxLeverage, trade.leverage || 1),
      );
      if (Number.isFinite(leverage) && trade.leverage !== leverage) {
        onChange({
          ...trade,
          leverage,
        });
      }
    }
  }, [isNewTrade, trade, minLeverage, maxLeverage, onChange]);

  return (
    <div
      className={classNames(
        'tw-relative tw-min-h-full tw-pb-16',
        disabled && 'tw-pointer-events-none',
      )}
    >
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-2.5 tw-mb-5">
        <button
          className={classNames(
            'tw-w-full tw-h-8 tw-font-semibold tw-text-base tw-text-white tw-bg-trade-long tw-rounded-lg',
            trade.position !== TradingPosition.LONG &&
              'tw-opacity-25 hover:tw-opacity-100 tw-transition-opacity tw-duration-300',
          )}
          onClick={bindSelectPosition(TradingPosition.LONG)}
        >
          {t(translations.perpetualPage.tradeForm.buttons.buy)}
        </button>
        <button
          className={classNames(
            'tw-w-full tw-h-8 tw-font-semibold tw-text-base tw-text-white tw-bg-trade-short tw-rounded-lg',
            trade.position !== TradingPosition.SHORT &&
              'tw-opacity-25 hover:tw-opacity-100 tw-transition-opacity tw-duration-300',
          )}
          onClick={bindSelectPosition(TradingPosition.SHORT)}
        >
          {t(translations.perpetualPage.tradeForm.buttons.sell)}
        </button>
      </div>
      <div className="tw-flex tw-flex-row tw-items-center tw-mb-4">
        <button
          className={classNames(
            'tw-h-8 tw-px-3 tw-py-1 tw-font-semibold tw-text-sm tw-text-sov-white tw-bg-gray-7 tw-rounded-lg',
            trade.tradeType !== PerpetualTradeType.MARKET &&
              'tw-opacity-25 hover:tw-opacity-100 tw-transition-opacity tw-duration-300',
          )}
          onClick={bindSelectTradeType(PerpetualTradeType.MARKET)}
        >
          {t(translations.perpetualPage.tradeForm.buttons.market)}
        </button>
        <Tooltip
          hoverOpenDelay={0}
          hoverCloseDelay={0}
          interactionKind="hover"
          position={PopoverPosition.BOTTOM_LEFT}
          content={t(translations.common.comingSoon)}
        >
          <button
            className="tw-h-8 tw-px-3 tw-py-1 tw-font-semibold tw-text-sm tw-text-sov-white tw-bg-gray-7 tw-rounded-lg tw-opacity-25 tw-cursor-not-allowed"
            disabled
          >
            {t(translations.perpetualPage.tradeForm.buttons.limit)}
          </button>
        </Tooltip>
        <div className="tw-flex tw-flex-row tw-items-between tw-justify-between tw-flex-1 tw-ml-2 tw-text-xs">
          <label className="tw-mr-1">
            {t(translations.perpetualPage.tradeForm.labels.maxTradeSize)}
          </label>
          <AssetValue
            minDecimals={0}
            maxDecimals={6}
            mode={AssetValueMode.auto}
            value={maxTradeSize}
            assetString={pair.baseAsset}
          />
        </div>
      </div>
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-4 tw-text-sm">
        <Tooltip
          position="bottom"
          popoverClassName="tw-max-w-md tw-font-light"
          content={t(translations.perpetualPage.tradeForm.tooltips.orderValue)}
        >
          <label>
            {t(translations.perpetualPage.tradeForm.labels.orderValue)}
          </label>
        </Tooltip>
        <div className="tw-flex-1 tw-mx-4 tw-text-right">
          <AssetSymbolRenderer assetString={pair.baseAsset} />
        </div>
        <Input
          className="tw-w-2/5"
          type="number"
          value={amount}
          step={lotSize}
          min={0}
          max={maxTradeSize}
          onChange={onChangeOrderAmount}
          onBlur={onBlurOrderAmount}
        />
      </div>
      <div
        className={classNames(
          'tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-4 tw-text-sm',
          trade.tradeType !== PerpetualTradeType.LIMIT && 'tw-hidden',
        )}
      >
        <label>
          {t(translations.perpetualPage.tradeForm.labels.limitPrice)}
        </label>
        <div className="tw-flex-1 tw-mx-4 tw-text-right">
          <AssetSymbolRenderer assetString={pair.quoteAsset} />
        </div>
        <Input
          className="tw-w-2/5"
          type="number"
          value={limit}
          step={0.1}
          min={0}
          onChange={onChangeOrderLimit}
        />
      </div>
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-text-xs tw-font-medium">
        <Tooltip
          position="bottom"
          popoverClassName="tw-max-w-md tw-font-light"
          content={t(translations.perpetualPage.tradeForm.tooltips.orderCost)}
        >
          <label>
            {t(translations.perpetualPage.tradeForm.labels.orderCost)}
          </label>
        </Tooltip>
        <Tooltip
          position={'auto-start'}
          content={
            <>
              <AssetValue
                className="tw-block tw-text-right"
                minDecimals={8}
                maxDecimals={8}
                mode={AssetValueMode.auto}
                value={requiredCollateral}
                assetString={collateralName}
              />
              <AssetValue
                className="tw-block tw-text-right"
                minDecimals={2}
                maxDecimals={2}
                mode={AssetValueMode.auto}
                value={requiredCollateral / quoteToCollateralFactor}
                assetString={pair.quoteAsset}
                isApproximation
              />
            </>
          }
        >
          <AssetValue
            minDecimals={4}
            maxDecimals={4}
            mode={AssetValueMode.auto}
            value={requiredCollateral}
            assetString={collateralName}
          />
        </Tooltip>
      </div>
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-4 tw-text-xs tw-font-medium">
        <Tooltip
          position="bottom"
          popoverClassName="tw-max-w-md tw-font-light"
          content={t(translations.perpetualPage.tradeForm.tooltips.tradingFee)}
        >
          <label>
            {t(translations.perpetualPage.tradeForm.labels.tradingFee)}
          </label>
        </Tooltip>
        <Tooltip
          position={'auto-start'}
          content={
            <>
              <AssetValue
                className="tw-block tw-text-right"
                minDecimals={8}
                maxDecimals={8}
                mode={AssetValueMode.auto}
                value={tradingFee}
                assetString={collateralName}
              />
              <AssetValue
                className="tw-block tw-text-right"
                minDecimals={2}
                maxDecimals={2}
                mode={AssetValueMode.auto}
                value={tradingFee / quoteToCollateralFactor}
                assetString={pair.quoteAsset}
                isApproximation
              />
            </>
          }
        >
          <AssetValue
            minDecimals={4}
            maxDecimals={4}
            mode={AssetValueMode.auto}
            value={tradingFee}
            assetString={collateralName}
          />
        </Tooltip>
      </div>
      {isNewTrade && (
        <LeverageSelector
          className="tw-mb-2"
          value={trade.leverage}
          min={minLeverage}
          max={maxLeverage}
          steps={pair.config.leverage.steps}
          onChange={onChangeLeverage}
        />
      )}
      <div className="tw-my-2 tw-text-secondary tw-text-xs">
        <button className="tw-flex tw-flex-row" onClick={onOpenSlippage}>
          <Trans
            i18nKey={
              translations.perpetualPage.tradeForm.buttons.slippageSettings
            }
          />
          <img className="tw-ml-2" alt="setting" src={settingImg} />
        </button>
      </div>
      {isNewTrade && (
        <div className="tw-flex tw-flex-row tw-justify-between tw-px-6 tw-py-1.5 tw-mt-4 tw-text-xs tw-font-medium tw-border tw-border-gray-5 tw-rounded-lg">
          <label>
            {t(
              translations.perpetualPage.tradeForm.labels[
                trade.position === TradingPosition.LONG
                  ? 'maxEntryPrice'
                  : 'minEntryPrice'
              ],
            )}
          </label>
          <AssetValue
            minDecimals={2}
            maxDecimals={2}
            mode={AssetValueMode.auto}
            value={limitPrice}
            assetString={pair.quoteAsset}
          />
        </div>
      )}
      {!isNewTrade && (
        <div className="tw-flex tw-flex-col tw-justify-between tw-px-6 tw-py-1.5 tw-mt-4 tw-text-xs tw-font-medium tw-border tw-border-gray-5 tw-rounded-lg">
          <LeverageViewer
            label={t(translations.perpetualPage.tradeForm.labels.leverage)}
            min={pair.config.leverage.min}
            max={maxLeverage}
            value={trade.leverage}
            valueLabel={`${toNumberFormat(trade.leverage, 2)}x`}
          />

          <div className="tw-flex tw-justify-between tw-mt-1.5">
            <label>
              {t(translations.perpetualPage.tradeForm.labels.liquidationPrice)}
            </label>
            <AssetValue
              minDecimals={2}
              maxDecimals={2}
              mode={AssetValueMode.auto}
              value={liquidationPrice}
              assetString={pair.quoteAsset}
            />
          </div>

          <div className="tw-flex tw-justify-between tw-mt-1.5">
            <label>
              {t(
                translations.perpetualPage.tradeForm.labels[
                  trade.position === TradingPosition.LONG
                    ? 'maxEntryPrice'
                    : 'minEntryPrice'
                ],
              )}
            </label>
            <AssetValue
              minDecimals={2}
              maxDecimals={2}
              mode={AssetValueMode.auto}
              value={limitPrice}
              assetString={pair.quoteAsset}
            />
          </div>
        </div>
      )}
      {validation && !validation.valid && validation.errors.length > 0 && (
        <div className="tw-flex tw-flex-col tw-justify-between tw-px-6 tw-py-1 tw-mt-4 tw-text-warning tw-text-xs tw-font-medium tw-border tw-border-warning tw-rounded-lg">
          {validation.errorMessages}
        </div>
      )}
      <div className="tw-absolute tw-bottom-0 tw-left-0 tw-right-0">
        {!inMaintenance ? (
          <button
            className={classNames(
              'tw-flex tw-flex-row tw-justify-between tw-items-center tw-w-full tw-h-12 tw-px-4 tw-font-semibold tw-text-base tw-text-white tw-bg-trade-long tw-rounded-lg tw-transition-opacity tw-duration-300',
              trade.position === TradingPosition.LONG
                ? 'tw-bg-trade-long'
                : 'tw-bg-trade-short',
              buttonDisabled
                ? 'tw-opacity-25 tw-cursor-not-allowed'
                : 'tw-opacity-100 hover:tw-opacity-75',
            )}
            onClick={onSubmit}
            disabled={buttonDisabled}
          >
            <span className="tw-mr-2">{tradeButtonLabel}</span>
            <span>
              {weiToNumberFormat(trade.amount, lotPrecision)} @{' '}
              {toNumberFormat(entryPrice, 2)}
            </span>
          </button>
        ) : (
          <ErrorBadge
            content={
              <Trans
                i18nKey={translations.maintenance.perpetualsTrade}
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
            className="tw-mb-0 tw-pb-0"
          />
        )}
      </div>
    </div>
  );
};
