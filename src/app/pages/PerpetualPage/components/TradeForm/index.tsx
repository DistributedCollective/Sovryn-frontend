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
import {
  PerpetualTrade,
  PerpetualTradeType,
  PERPETUAL_EXPIRY_DEFAULT,
} from '../../types';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { Input } from '../../../../components/Input';
import { Tooltip } from '@blueprintjs/core';
import { AssetValue } from '../../../../components/AssetValue';
import { AssetValueMode } from '../../../../components/AssetValue/types';
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
import { perpMath, perpUtils } from '@sovryn/perpetual-swap';
import { getRequiredMarginCollateralWithGasFees } from '../../utils/perpUtils';
import { usePerpetual_getCurrentPairId } from '../../hooks/usePerpetual_getCurrentPairId';
import { bignumber } from 'mathjs';
import { ExpiryDateInput } from './components/ExpiryDateInput';
import { ResultingPosition } from './components/ResultingPosition';

const { shrinkToLot } = perpMath;
const {
  getTradingFee,
  getQuote2CollateralFX,
  calculateSlippagePrice,
  calculateLeverage,
  getMaxInitialLeverage,
  getPrice,
  getSignedMaxAbsPositionForTrader,
} = perpUtils;

interface ITradeFormProps {
  trade: PerpetualTrade;
  disabled?: boolean;
  onChange: (trade: PerpetualTrade) => void;
  onSubmit: () => void;
  onOpenSlippage: () => void;
}

export const TradeForm: React.FC<ITradeFormProps> = ({
  trade,
  disabled,
  onChange,
  onSubmit,
  onOpenSlippage,
}) => {
  const { t } = useTranslation();

  const { pairType, collateral } = useSelector(selectPerpetualPage);

  const inMaintenance = usePerpetual_isTradingInMaintenance();

  const { useMetaTransactions } = useSelector(selectPerpetualPage);

  const currentPairId = usePerpetual_getCurrentPairId();
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
  } = perpetuals[currentPairId];

  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);
  const collateralName = useMemo(() => getCollateralName(collateral), [
    collateral,
  ]);

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

    // max leverage for limit and stop orders should equal to max leverage for huge positions and not the actual target amount so we don't allow users to place multiple high leverage small positions
    const position =
      trade.tradeType === PerpetualTradeType.MARKET ? amountTarget : 1000000000;

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
        ),
      ),
    );

    return [minLeverage, maxLeverage];
  }, [
    trade.position,
    trade.amount,
    trade.tradeType,
    traderState,
    availableBalance,
    perpParameters,
    ammState,
    useMetaTransactions,
    pair.config.leverage.min,
  ]);

  const [amount, setAmount] = useState(
    Math.abs(numberFromWei(trade.amount)).toFixed(lotPrecision),
  );

  useEffect(() => {
    if (bignumber(amount).greaterThan(maxTradeSize)) {
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

      let newTrade = { ...trade, amount: toWei(roundedAmount) };

      newTrade.leverage = Math.max(
        minLeverage,
        Math.min(maxLeverage, newTrade.leverage),
      );

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

  const [limit, setLimit] = useState(trade.limit);
  const onChangeOrderLimit = useCallback(
    (limit: string) => {
      setLimit(limit);
      onChange({ ...trade, limit: toWei(limit) });
    },
    [onChange, trade],
  );

  useEffect(() => {
    if (!limit || bignumber(limit).lessThanOrEqualTo(0)) {
      setLimit(String(Math.floor(entryPrice)));
    }
  }, [entryPrice, limit]);

  const [triggerPrice, setTriggerPrice] = useState(trade.trigger);
  const onChangeTriggerPrice = useCallback(
    (triggerPrice: string) => {
      setTriggerPrice(triggerPrice);
      onChange({ ...trade, trigger: toWei(triggerPrice) });
    },
    [onChange, trade],
  );

  useEffect(() => {
    if (!triggerPrice || bignumber(triggerPrice).lessThanOrEqualTo(0)) {
      setTriggerPrice(String(Math.floor(entryPrice)));
    }
  }, [entryPrice, triggerPrice]);

  const [expiry, setExpiry] = useState(String(PERPETUAL_EXPIRY_DEFAULT));
  const onChangeExpiry = useCallback(
    (expiry: string) => {
      setExpiry(expiry);
      onChange({ ...trade, expiry: Number(expiry) });
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
    (tradeType: PerpetualTradeType) => () =>
      onChange({ ...trade, tradeType: tradeType }),
    [onChange, trade],
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

  const requiredCollateral = useMemo(() => {
    const amount = getSignedAmount(trade.position, trade.amount);
    return getRequiredMarginCollateralWithGasFees(
      trade.leverage,
      Number(amount),
      perpParameters,
      ammState,
      traderState,
      trade.slippage,
      useMetaTransactions,
    );
  }, [
    trade.position,
    trade.amount,
    trade.leverage,
    trade.slippage,
    traderState,
    perpParameters,
    ammState,
    useMetaTransactions,
  ]);

  const tradingFee = useMemo(
    () => getTradingFee(numberFromWei(trade.amount), perpParameters, ammState),
    [trade.amount, perpParameters, ammState],
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

  const validation = useMemo(() => {
    const signedAmount = getSignedAmount(trade.position, trade.amount);
    const marginChange = requiredCollateral;
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
  }, [trade, minLeverage, maxLeverage, onChange]);

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
          onChange={onChangeOrderAmount}
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
          value={triggerPrice}
          step={1}
          min={0}
          onChange={onChangeTriggerPrice}
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
              value={limit}
              step={1}
              min={0}
              onChange={onChangeOrderLimit}
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
      <div
        className={classNames(
          'tw-flex tw-flex-row tw-items-center tw-justify-between tw-text-xs tw-font-medium',
          {
            'tw-mb-4': trade.tradeType === PerpetualTradeType.MARKET,
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
      />

      {trade.tradeType === PerpetualTradeType.MARKET && (
        <>
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
              {trade.tradeType === PerpetualTradeType.MARKET
                ? toNumberFormat(entryPrice, 2)
                : limit}
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
