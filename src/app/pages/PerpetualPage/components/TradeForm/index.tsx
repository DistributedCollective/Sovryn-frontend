import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
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
import {
  PerpetualTrade,
  PerpetualTradeType,
  PERPETUAL_EXPIRY_DEFAULT,
} from '../../types';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { Input } from '../../../../components/Input';
import { PopoverPosition, Tooltip } from '@blueprintjs/core';
import { AssetValue } from '../../../../components/AssetValue';
import { AssetValueMode } from '../../../../components/AssetValue/types';
import { getSignedAmount, getTradeDirection } from '../../utils/contractUtils';
import { PerpetualQueriesContext } from '../../contexts/PerpetualQueriesContext';
import { usePerpetual_isTradingInMaintenance } from '../../hooks/usePerpetual_isTradingInMaintenance';
import {
  numberFromWei,
  toWei,
  isValidNumerishValue,
} from 'utils/blockchain/math-helpers';
import { useSelector } from 'react-redux';
import { selectPerpetualPage } from '../../selectors';
import { getCollateralName } from '../../utils/renderUtils';
import { TxType } from '../../../../../store/global/transactions-store/types';
import { perpMath, perpUtils } from '@sovryn/perpetual-swap';
import { bignumber } from 'mathjs';
import { ExpiryDateInput } from './components/ExpiryDateInput';
import { ResultingPosition } from './components/ResultingPosition';
import { Checkbox } from 'app/components/Checkbox';
import { usePerpetual_analyseTrade } from '../../hooks/usePerpetual_analyseTrade';
import { getTraderPnLInCC } from '@sovryn/perpetual-swap/dist/scripts/utils/perpUtils';
import { ValidationHint } from '../ValidationHint/ValidationHint';

const { shrinkToLot } = perpMath;
const {
  getTradingFee,
  getQuote2CollateralFX,
  getTraderLeverage,
  calculateLeverage,
  getMaxInitialLeverage,
  getPrice,
  getSignedMaxAbsPositionForTrader,
} = perpUtils;

interface ITradeFormProps {
  trade: PerpetualTrade;
  disabled?: boolean;
  setTrade: Dispatch<SetStateAction<PerpetualTrade>>;
  onSubmit: (trade: PerpetualTrade) => void;
  onOpenSlippage: () => void;
}

export const TradeForm: React.FC<ITradeFormProps> = ({
  trade,
  disabled,
  setTrade,
  onSubmit,
  onOpenSlippage,
}) => {
  const pair = useMemo(() => PerpetualPairDictionary.get(trade.pairType), [
    trade.pairType,
  ]);

  const { t } = useTranslation();

  const inMaintenance = usePerpetual_isTradingInMaintenance();

  const { useMetaTransactions } = useSelector(selectPerpetualPage);

  const { perpetuals } = useContext(PerpetualQueriesContext);
  const {
    ammState,
    traderState,
    perpetualParameters: perpParameters,
    liquidityPoolState: liqPoolState,
    averagePrice,
    lotSize,
    lotPrecision,
    availableBalance,
  } = perpetuals[pair.id];

  const collateralName = useMemo(
    () => getCollateralName(pair.collateralAsset),
    [pair.collateralAsset],
  );

  const maxTradeSize = useMemo(() => {
    const maxTradeSize = shrinkToLot(
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

    return Number.isFinite(maxTradeSize) ? maxTradeSize : 0;
  }, [
    trade.position,
    trade.slippage,
    availableBalance,
    perpParameters,
    traderState,
    ammState,
    liqPoolState,
    lotSize,
  ]);

  const isMarketOrder = useMemo(
    () => trade.tradeType === PerpetualTradeType.MARKET,
    [trade.tradeType],
  );

  const hasOpenTrades = traderState?.marginAccountPositionBC !== 0;

  const [minLeverage, maxLeverage] = useMemo(() => {
    const amountChange = getSignedAmount(trade.position, trade.amount);
    const amountTarget = traderState.marginAccountPositionBC + amountChange;
    let possibleMargin =
      numberFromWei(availableBalance) +
      traderState.availableCashCC -
      getTradingFee(amountChange, perpParameters, ammState);
    if (useMetaTransactions) {
      possibleMargin -= gasLimit[TxType.PERPETUAL_TRADE];
    }

    // Reduce possible margin slightly to account for calculation
    possibleMargin += getTraderPnLInCC(traderState, ammState, perpParameters);
    // max leverage for limit and stop orders should equal to max leverage for huge positions
    // and not the actual target amount so we don't allow users to place multiple high leverage small positions
    const position = isMarketOrder ? amountTarget : 1000000000;

    const maxLeverage = getMaxInitialLeverage(position, perpParameters);

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
          trade.slippage,
        ),
      ),
    );

    return [minLeverage, maxLeverage];
  }, [
    trade.position,
    trade.amount,
    trade.slippage,
    traderState,
    availableBalance,
    perpParameters,
    ammState,
    useMetaTransactions,
    isMarketOrder,
    pair.config.leverage.min,
  ]);

  const [amount, setAmount] = useState(
    Math.abs(numberFromWei(trade.amount)).toFixed(lotPrecision),
  );

  useEffect(() => {
    if (
      isValidNumerishValue(amount) &&
      bignumber(amount).greaterThan(maxTradeSize)
    ) {
      setAmount(String(maxTradeSize));
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

      setTrade(trade => ({
        ...trade,
        amount: toWei(roundedAmount),
        leverage: Math.max(minLeverage, Math.min(maxLeverage, trade.leverage)),
      }));
    },
    [lotSize, lotPrecision, maxTradeSize, minLeverage, maxLeverage, setTrade],
  );

  const onBlurOrderAmount = useCallback(() => {
    setAmount(numberFromWei(trade.amount).toFixed(lotPrecision));
  }, [lotPrecision, trade.amount]);

  const entryPrice = useMemo(
    () =>
      getPrice(
        getSignedAmount(trade.position, trade.amount),
        perpParameters,
        ammState,
      ),
    [trade.position, trade.amount, perpParameters, ammState],
  );

  const [limit, setLimit] = useState<string>();
  const onChangeOrderLimit = useCallback(
    (limit: string) => {
      setLimit(limit);
      setTrade(trade => ({ ...trade, limit: toWei(limit) }));
    },
    [setTrade],
  );

  const [triggerPrice, setTriggerPrice] = useState<string>();
  const onChangeTriggerPrice = useCallback(
    (triggerPrice: string) => {
      setTriggerPrice(triggerPrice);
      setTrade(trade => ({ ...trade, trigger: toWei(triggerPrice) }));
    },
    [setTrade],
  );

  useEffect(() => {
    if (entryPrice && (limit === undefined || triggerPrice === undefined)) {
      setTrade(trade => ({
        ...trade,
        limit: limit === undefined ? toWei(entryPrice) : trade.limit,
        trigger: triggerPrice === undefined ? toWei(entryPrice) : trade.trigger,
      }));
    }
  }, [entryPrice, limit, triggerPrice, setTrade]);

  const [expiry, setExpiry] = useState(String(PERPETUAL_EXPIRY_DEFAULT));
  const onChangeExpiry = useCallback(
    (expiry: string) => {
      setExpiry(expiry);
      setTrade(trade => ({ ...trade, expiry: Number(expiry) }));
    },
    [setTrade],
  );

  const onChangeLeverage = useCallback(
    (leverage: number) => {
      setTrade({ ...trade, leverage });
    },
    [setTrade, trade],
  );

  const bindSelectPosition = useCallback(
    (position: TradingPosition) => () =>
      setTrade(trade => ({ ...trade, position })),
    [setTrade],
  );

  const bindSelectTradeType = useCallback(
    (tradeType: PerpetualTradeType) => () =>
      setTrade(trade => ({ ...trade, tradeType: tradeType })),
    [setTrade],
  );

  const tradeButtonLabel = useMemo(() => {
    const i18nKey = {
      LONG_LIMIT: translations.perpetualPage.tradeForm.buttons.buyLimit,
      LONG_MARKET: translations.perpetualPage.tradeForm.buttons.buyMarket,
      LONG_STOP: translations.perpetualPage.tradeForm.buttons.buyStop,
      SHORT_LIMIT: translations.perpetualPage.tradeForm.buttons.sellLimit,
      SHORT_MARKET: translations.perpetualPage.tradeForm.buttons.sellMarket,
      SHORT_STOP: translations.perpetualPage.tradeForm.buttons.sellStop,
    }[`${trade.position}_${trade.tradeType}`];

    return i18nKey && t(i18nKey);
  }, [t, trade.position, trade.tradeType]);

  const quoteToCollateralFactor = useMemo(
    () => getQuote2CollateralFX(ammState),
    [ammState],
  );

  const {
    orderCost,
    tradingFee,
    limitPrice,
    amountTarget,
    validation,
  } = usePerpetual_analyseTrade(trade);

  const buttonDisabled = useMemo(
    () =>
      disabled ||
      Number(amount) <= 0 ||
      (validation && !validation.valid && !validation.isWarning),
    [disabled, amount, validation],
  );

  // clamp leverage
  useEffect(() => {
    const leverage = Math.max(
      minLeverage,
      Math.min(
        maxLeverage,
        trade.keepPositionLeverage
          ? getTraderLeverage(traderState, ammState)
          : trade.leverage || 1,
      ),
    );
    if (Number.isFinite(leverage) && trade.leverage !== leverage) {
      setTrade({
        ...trade,
        leverage,
      });
    }
  }, [trade, minLeverage, maxLeverage, traderState, ammState, setTrade]);

  const signedAmount = useMemo(
    () => getSignedAmount(trade.position, trade.amount),
    [trade.amount, trade.position],
  );

  const resultingPositionSize = useMemo(
    () => traderState.marginAccountPositionBC + signedAmount,
    [signedAmount, traderState.marginAccountPositionBC],
  );

  const [keepPositionLeverage, setKeepPositionLeverage] = useState(false);

  const onChangeKeepPositionLeverage = useCallback(
    (keepPositionLeverage: boolean) => {
      setKeepPositionLeverage(keepPositionLeverage);
      setTrade(trade => ({ ...trade, keepPositionLeverage }));
    },
    [setTrade],
  );

  const isLeverageDisabled = useMemo(
    () =>
      isMarketOrder &&
      (keepPositionLeverage ||
        (Number(amount) !== 0 && Math.abs(resultingPositionSize) < lotSize)),
    [
      isMarketOrder,
      keepPositionLeverage,
      amount,
      resultingPositionSize,
      lotSize,
    ],
  );

  const onSubmitWrapper = useCallback(() => {
    const completeTrade = {
      ...trade,
      averagePrice: toWei(averagePrice),
      entryPrice: toWei(entryPrice),
      isClosePosition: isMarketOrder && Math.abs(amountTarget) < lotSize,
    };

    if (trade.tradeType !== PerpetualTradeType.MARKET) {
      if (
        !completeTrade.limit ||
        bignumber(completeTrade.limit).lessThanOrEqualTo(0)
      ) {
        completeTrade.limit = limit ? toWei(limit) : '0';
      }

      if (completeTrade.tradeType === PerpetualTradeType.STOP) {
        if (
          !completeTrade.trigger ||
          bignumber(completeTrade.trigger).lessThanOrEqualTo(0)
        ) {
          completeTrade.trigger = triggerPrice ? toWei(triggerPrice) : '0';
        }
      } else {
        completeTrade.trigger = '0';
      }

      completeTrade.slippage = 0;
      completeTrade.keepPositionLeverage = false;
    }

    onSubmit(completeTrade);
  }, [
    trade,
    averagePrice,
    entryPrice,
    isMarketOrder,
    amountTarget,
    lotSize,
    onSubmit,
    limit,
    triggerPrice,
  ]);

  useEffect(() => {
    // resets trade.keepPositionLeverage in case we flip the sign
    if (trade.tradeType !== PerpetualTradeType.MARKET && keepPositionLeverage) {
      onChangeKeepPositionLeverage(false);
    }
  }, [keepPositionLeverage, onChangeKeepPositionLeverage, trade.tradeType]);

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

        <button
          className={classNames(
            'tw-h-8 tw-px-3 tw-py-1 tw-font-semibold tw-text-sm tw-text-sov-white tw-bg-gray-7 tw-rounded-lg',
            trade.tradeType !== PerpetualTradeType.LIMIT &&
              'tw-opacity-25 hover:tw-opacity-100 tw-transition-opacity tw-duration-300',
          )}
          onClick={bindSelectTradeType(PerpetualTradeType.LIMIT)}
        >
          {t(translations.perpetualPage.tradeForm.buttons.limit)}
        </button>

        <button
          className={classNames(
            'tw-h-8 tw-px-3 tw-py-1 tw-font-semibold tw-text-sm tw-text-sov-white tw-bg-gray-7 tw-rounded-lg',
            trade.tradeType !== PerpetualTradeType.STOP &&
              'tw-opacity-25 hover:tw-opacity-100 tw-transition-opacity tw-duration-300',
          )}
          onClick={bindSelectTradeType(PerpetualTradeType.STOP)}
        >
          {t(translations.perpetualPage.tradeForm.buttons.stop)}
        </button>
      </div>
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-4 tw-text-sm">
        <Tooltip
          position="bottom"
          popoverClassName="tw-max-w-md tw-font-light"
          content={t(translations.perpetualPage.tradeForm.tooltips.orderSize)}
        >
          <label>
            {t(translations.perpetualPage.tradeForm.labels.orderSize)}
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
          onChangeText={onChangeOrderAmount}
          onBlur={onBlurOrderAmount}
        />
      </div>

      <div className="tw-flex tw-justify-end tw-flex-1 tw--mt-3 tw-mb-4 tw-text-xs">
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

      <div
        className={classNames(
          'tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-4 tw-text-sm',
          trade.tradeType !== PerpetualTradeType.STOP && 'tw-hidden',
        )}
      >
        <label>
          {t(translations.perpetualPage.tradeForm.labels.triggerPrice)}
        </label>
        <div className="tw-flex-1 tw-mx-4 tw-text-right">
          <AssetSymbolRenderer assetString={pair.quoteAsset} />
        </div>
        <Input
          className="tw-w-2/5"
          type="number"
          value={
            triggerPrice !== undefined
              ? triggerPrice
              : numberFromWei(trade.trigger).toFixed(2)
          }
          step={1}
          min={0}
          onChangeText={onChangeTriggerPrice}
        />
      </div>

      {(trade.tradeType === PerpetualTradeType.LIMIT ||
        trade.tradeType === PerpetualTradeType.STOP) && (
        <>
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-4 tw-text-sm">
            <label>
              {t(translations.perpetualPage.tradeForm.labels.limitPrice)}
            </label>
            <div className="tw-flex-1 tw-mx-4 tw-text-right">
              <AssetSymbolRenderer assetString={pair.quoteAsset} />
            </div>
            <Input
              className="tw-w-2/5"
              type="number"
              value={
                limit !== undefined
                  ? limit
                  : numberFromWei(trade.limit).toFixed(2)
              }
              step={1}
              min={0}
              onChangeText={onChangeOrderLimit}
            />
          </div>

          <div className="tw-flex tw-flex-row tw-justify-between tw-mb-4 tw-text-sm">
            <label className="tw-mt-1.5">
              {t(translations.perpetualPage.tradeForm.labels.expiry)}
            </label>
            <span className="tw-flex-1 tw-mt-1.5 tw-mx-4 tw-text-right tw-font-medium">
              {t(translations.perpetualPage.tradeForm.labels.days)}
            </span>
            <ExpiryDateInput value={expiry} onChange={onChangeExpiry} />
          </div>
        </>
      )}

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
                value={orderCost}
                assetString={collateralName}
              />
              {(!pair.isQuanto || isMarketOrder) && (
                <AssetValue
                  className="tw-block tw-text-right"
                  minDecimals={2}
                  maxDecimals={2}
                  mode={AssetValueMode.auto}
                  value={orderCost / quoteToCollateralFactor}
                  assetString={pair.quoteAsset}
                  isApproximation
                />
              )}
            </>
          }
        >
          <AssetValue
            minDecimals={4}
            maxDecimals={4}
            mode={AssetValueMode.auto}
            value={orderCost}
            assetString={collateralName}
          />
        </Tooltip>
      </div>
      <div
        className={classNames(
          'tw-flex tw-flex-row tw-items-center tw-justify-between tw-text-xs tw-font-medium',
          {
            'tw-mb-4': isMarketOrder,
          },
        )}
      >
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

      {(trade.tradeType === PerpetualTradeType.LIMIT ||
        trade.tradeType === PerpetualTradeType.STOP) && (
        <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-4 tw-text-xs tw-font-medium">
          <Tooltip
            position="bottom"
            popoverClassName="tw-max-w-md tw-font-light"
            content={t(
              translations.perpetualPage.tradeForm.tooltips.relayerFee,
            )}
          >
            <label>
              {t(translations.perpetualPage.tradeForm.labels.relayerFee)}
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
                  value={perpParameters.fReferralRebateCC}
                  assetString={collateralName}
                />
                <AssetValue
                  className="tw-block tw-text-right"
                  minDecimals={2}
                  maxDecimals={2}
                  mode={AssetValueMode.auto}
                  value={
                    perpParameters.fReferralRebateCC / quoteToCollateralFactor
                  }
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
              value={perpParameters.fReferralRebateCC}
              assetString={collateralName}
            />
          </Tooltip>
        </div>
      )}

      <LeverageSelector
        className="tw-mb-2"
        value={trade.leverage}
        min={minLeverage}
        max={maxLeverage}
        steps={pair.config.leverage.steps}
        onChange={onChangeLeverage}
        disabled={isLeverageDisabled}
      />

      {isMarketOrder && (
        <>
          <Tooltip
            popoverClassName="tw-max-w-md"
            content={t(
              translations.perpetualPage.tradeForm.tooltips
                .keepPositionLeverage,
            )}
            position={PopoverPosition.TOP}
          >
            <Checkbox
              checked={keepPositionLeverage}
              onChange={() =>
                onChangeKeepPositionLeverage(!keepPositionLeverage)
              }
              disabled={!hasOpenTrades}
              label={t(
                translations.perpetualPage.tradeForm.labels
                  .keepPositionLeverage,
              )}
              data-action-id="keep-position-leverage"
              className="tw-text-sm"
            />
          </Tooltip>
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

          <ResultingPosition
            trade={trade}
            minLeverage={minLeverage}
            maxLeverage={maxLeverage}
            limitOrderPrice={limitPrice}
          />
        </>
      )}

      {Number(amount) > 0 && (
        <ValidationHint className="tw-mt-4" validation={validation} />
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
            onClick={onSubmitWrapper}
            disabled={buttonDisabled}
          >
            <span className="tw-mr-2">{tradeButtonLabel}</span>
            <span>
              {weiToNumberFormat(trade.amount, lotPrecision)} @{' '}
              {isMarketOrder
                ? toNumberFormat(entryPrice, 2)
                : toNumberFormat(limitPrice, 2)}
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
