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
import {
  getMinimalPositionSize,
  getTraderPnLInCC,
} from '@sovryn/perpetual-swap/dist/scripts/utils/perpUtils';
import { ValidationHint } from '../ValidationHint/ValidationHint';
import styles from './index.module.scss';

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

  const minimumPositionSize = useMemo(
    () =>
      String(
        Number(getMinimalPositionSize(perpParameters).toFixed(lotPrecision)), // Number conversion is performed so we trim additional zeros
      ),

    [lotPrecision, perpParameters],
  );

  const collateralName = useMemo(
    () => getCollateralName(pair.collateralAsset),
    [pair.collateralAsset],
  );

  const hasOpenTrades = useMemo(
    () => traderState?.marginAccountPositionBC !== 0,
    [traderState?.marginAccountPositionBC],
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

    const finiteMaxTradeSize = Number.isFinite(maxTradeSize) ? maxTradeSize : 0;

    return hasOpenTrades
      ? Math.max(
          finiteMaxTradeSize,
          Math.abs(traderState.marginAccountPositionBC),
        )
      : finiteMaxTradeSize;
  }, [
    trade.position,
    trade.slippage,
    availableBalance,
    perpParameters,
    traderState,
    ammState,
    liqPoolState,
    lotSize,
    hasOpenTrades,
  ]);

  const isMarketOrder = useMemo(
    () => trade.tradeType === PerpetualTradeType.MARKET,
    [trade.tradeType],
  );

  const isLimitOrder = useMemo(
    () =>
      [PerpetualTradeType.LIMIT, PerpetualTradeType.STOP].includes(
        trade.tradeType,
      ),
    [trade.tradeType],
  );

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

  useEffect(() => {
    if (
      isValidNumerishValue(amount) &&
      !bignumber(amount).isZero() &&
      bignumber(amount).lessThan(lotSize)
    ) {
      setAmount(String(lotSize));
      setTrade(trade => ({ ...trade, amount: toWei(lotSize) }));
    }
  }, [amount, lotSize, setTrade]);

  useEffect(() => {
    if (
      !hasOpenTrades &&
      isValidNumerishValue(amount) &&
      !bignumber(amount).isZero() &&
      bignumber(amount).lessThan(minimumPositionSize)
    ) {
      setAmount(minimumPositionSize);
      setTrade(trade => ({ ...trade, amount: toWei(minimumPositionSize) }));
    }
  }, [amount, hasOpenTrades, lotPrecision, minimumPositionSize, setTrade]);

  const onChangeOrderAmount = useCallback(
    (amount: string) => {
      const roundedAmount = Number(
        shrinkToLot(
          Math.max(Math.min(Number(amount) || 0, maxTradeSize), 0),
          perpParameters.fLotSizeBC, // non-rounded lot size
        ).toFixed(lotPrecision),
      );
      setAmount(amount);

      setTrade(trade => ({
        ...trade,
        amount: toWei(roundedAmount),
        leverage: Math.max(minLeverage, Math.min(maxLeverage, trade.leverage)),
      }));
    },
    [
      maxTradeSize,
      perpParameters.fLotSizeBC,
      lotPrecision,
      setTrade,
      minLeverage,
      maxLeverage,
    ],
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

  const resetForm = useCallback(() => {
    if (trade.tradeType === PerpetualTradeType.MARKET) {
      setAmount('0');
      setTrade({ ...trade, amount: '0', leverage: 1 });
    } else {
      setAmount('0');
      setLimit(undefined);
      setTriggerPrice(undefined);

      setTrade({
        ...trade,
        amount: '0',
        limit: undefined,
        trigger: undefined,
        leverage: 1,
        reduceOnly: undefined,
      });
    }
  }, [setTrade, trade]);

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

  const onReduceOnly = useCallback(() => {
    setTrade(prevTrade => ({
      ...prevTrade,
      reduceOnly: !prevTrade.reduceOnly,
    }));
  }, [setTrade]);

  const bindSelectPosition = useCallback(
    (position: TradingPosition) => setTrade(trade => ({ ...trade, position })),
    [setTrade],
  );

  const bindSelectTradeType = useCallback(
    (tradeType: PerpetualTradeType) => () =>
      setTrade(trade => ({ ...trade, tradeType: tradeType })),
    [setTrade],
  );

  const onLongClick = useCallback(() => {
    resetForm();
    bindSelectPosition(TradingPosition.LONG);
  }, [bindSelectPosition, resetForm]);

  const onShortClick = useCallback(() => {
    resetForm();
    bindSelectPosition(TradingPosition.SHORT);
  }, [bindSelectPosition, resetForm]);

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
    setAmount(
      trade.amount !== '0'
        ? Math.abs(numberFromWei(trade.amount)).toFixed(lotPrecision)
        : '0',
    );
    setTriggerPrice(
      trade.trigger ? numberFromWei(trade.trigger).toFixed(2) : undefined,
    );
    setLimit(trade.limit ? numberFromWei(trade.limit).toFixed(2) : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lotPrecision, trade.pairType]);

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
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-5">
        <button
          className={classNames(styles.positionButton, styles.long, {
            [styles.active]: trade.position === TradingPosition.LONG,
          })}
          onClick={onLongClick}
          data-action-id="perps-tradeForm-positionButton-buy"
        >
          {t(translations.perpetualPage.tradeForm.buttons.buy)}
        </button>
        <button
          className={classNames(styles.positionButton, styles.short, {
            [styles.active]: trade.position === TradingPosition.SHORT,
          })}
          onClick={onShortClick}
          data-action-id="perps-tradeForm-positionButton-sell"
        >
          {t(translations.perpetualPage.tradeForm.buttons.sell)}
        </button>
      </div>
      <div className="tw-p-4 tw-pt-2">
        <div className="tw-flex tw-flex-row tw-items-center tw-mb-6">
          <button
            className={classNames(styles.tradeTypeButton, {
              [styles.active]: trade.tradeType === PerpetualTradeType.MARKET,
            })}
            onClick={bindSelectTradeType(PerpetualTradeType.MARKET)}
            data-action-id="perps-tradeForm-tradeTypeButton-market"
          >
            {t(translations.perpetualPage.tradeForm.buttons.market)}
          </button>

          <button
            className={classNames(styles.tradeTypeButton, {
              [styles.active]: trade.tradeType === PerpetualTradeType.LIMIT,
            })}
            onClick={bindSelectTradeType(PerpetualTradeType.LIMIT)}
            data-action-id="perps-tradeForm-tradeTypeButton-limit"
          >
            {t(translations.perpetualPage.tradeForm.buttons.limit)}
          </button>

          <button
            className={classNames(styles.tradeTypeButton, {
              [styles.active]: trade.tradeType === PerpetualTradeType.STOP,
            })}
            onClick={bindSelectTradeType(PerpetualTradeType.STOP)}
            data-action-id="perps-tradeForm-tradeTypeButton-stop"
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
            dataActionId="perps-tradeForm-orderSize"
          />
        </div>

        <div className="tw-flex tw-justify-end tw-flex-1 tw--mt-3 tw-mb-4 tw-text-xs">
          <Tooltip
            position="bottom"
            popoverClassName="tw-max-w-md tw-font-light"
            content={t(
              translations.perpetualPage.tradeForm.tooltips.maxTradeSize,
            )}
          >
            <label className="tw-mr-1">
              {t(translations.perpetualPage.tradeForm.labels.maxTradeSize)}
            </label>
          </Tooltip>
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
          <Tooltip
            position="bottom"
            popoverClassName="tw-max-w-md tw-font-light"
            content={t(
              translations.perpetualPage.tradeForm.tooltips.triggerPrice,
            )}
          >
            <label>
              {t(translations.perpetualPage.tradeForm.labels.triggerPrice)}
            </label>
          </Tooltip>
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

        {isLimitOrder && (
          <>
            <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-4 tw-text-sm">
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.tradeForm.tooltips.limitPrice,
                )}
              >
                <label>
                  {t(translations.perpetualPage.tradeForm.labels.limitPrice)}
                </label>
              </Tooltip>

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
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.tradeForm.tooltips.expiry,
                )}
              >
                <label className="tw-mt-1.5">
                  {t(translations.perpetualPage.tradeForm.labels.expiry)}
                </label>
              </Tooltip>
              <span className="tw-flex-1 tw-mt-1.5 tw-mx-4 tw-text-right tw-font-medium">
                {t(translations.perpetualPage.tradeForm.labels.days)}
              </span>
              <ExpiryDateInput value={expiry} onChange={onChangeExpiry} />
            </div>

            <div className="tw-mb-2">
              <Tooltip
                popoverClassName="tw-max-w-md"
                content={t(
                  translations.perpetualPage.tradeForm.tooltips.reduceOnly,
                )}
                position={PopoverPosition.TOP}
              >
                <Checkbox
                  checked={trade.reduceOnly || false}
                  onChange={onReduceOnly}
                  label={t(
                    translations.perpetualPage.tradeForm.labels.reduceOnly,
                  )}
                  data-action-id="perps-tradeForm-reduceOnly"
                  className="tw-text-sm"
                />
              </Tooltip>
            </div>
          </>
        )}

        <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-text-xs tw-font-medium">
          <Tooltip
            position="bottom"
            popoverClassName="tw-max-w-md tw-font-light"
            content={t(
              translations.perpetualPage.tradeForm.tooltips[
                isLimitOrder ? 'orderCostLimit' : 'orderCost'
              ],
            )}
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
            'tw-flex tw-flex-row tw-items-center tw-justify-between tw-text-xs tw-font-medium tw-ml-2 tw-text-gray-8',
            {
              'tw-mb-4': isMarketOrder,
            },
          )}
        >
          <Tooltip
            position="bottom"
            popoverClassName="tw-max-w-md tw-font-light"
            content={t(
              translations.perpetualPage.tradeForm.tooltips.tradingFee,
            )}
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

        {isLimitOrder && (
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-4 tw-text-xs tw-font-medium tw-ml-2 tw-text-gray-8">
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
          tooltip={t(translations.perpetualPage.tradeForm.tooltips.leverage)}
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
              <button
                className="tw-flex tw-flex-row"
                onClick={onOpenSlippage}
                data-action-id="perps-tradeForm-slippage"
              >
                <Trans
                  i18nKey={
                    translations.perpetualPage.tradeForm.buttons
                      .slippageSettings
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
        <div className="tw-absolute tw-bottom-4 tw-left-4 tw-right-4">
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
              data-action-id={
                trade.position === TradingPosition.LONG
                  ? 'perps-tradeForm-submit-buy'
                  : 'perps-tradeForm-submit-sell'
              }
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
    </div>
  );
};
