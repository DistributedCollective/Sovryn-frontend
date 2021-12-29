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
import { discordInvite } from 'utils/classifiers';
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
  getMaximalTradeSizeInPerpetual,
  getRequiredMarginCollateral,
  getTradingFee,
  calculateApproxLiquidationPrice,
  calculateSlippagePrice,
  calculateLeverage,
  getMaxInitialLeverage,
} from '../../utils/perpUtils';
import { shrinkToLot } from '../../utils/perpMath';
import {
  getSignedAmount,
  getTradeDirection,
  validatePositionChange,
} from '../../utils/contractUtils';
import { PerpetualQueriesContext } from '../../contexts/PerpetualQueriesContext';
import { usePerpetual_isTradingInMaintenance } from '../../hooks/usePerpetual_isTradingInMaintenance';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { fromWei, toWei } from 'web3-utils';

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

  const {
    ammState,
    traderState,
    perpetualParameters: perpParameters,
    liquidityPoolState: liqPoolState,
    averagePrice,
    lotSize,
    lotPrecision,
  } = useContext(PerpetualQueriesContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onChange({ ...trade, entryPrice: averagePrice }), [
    averagePrice,
    onChange,
  ]);

  const maxTradeSize = useMemo(() => {
    const maxTradeSize = Number(
      Math.abs(
        getMaximalTradeSizeInPerpetual(
          traderState.marginAccountPositionBC,
          getTradeDirection(trade.position),
          ammState,
          liqPoolState,
          perpParameters,
        ),
      ).toPrecision(8),
    );
    return Number.isFinite(maxTradeSize) ? maxTradeSize : 0;
  }, [
    traderState.marginAccountPositionBC,
    trade.position,
    ammState,
    liqPoolState,
    perpParameters,
  ]);

  const [amount, setAmount] = useState(fromWei(trade.amount).replace(/^-/, ''));
  const onChangeOrderAmount = useCallback(
    (amount: string) => {
      const roundedAmount = shrinkToLot(
        Math.max(Math.min(Number(amount) || 0, maxTradeSize), 0),
        lotSize,
      );
      setAmount(amount);
      const amountChange = roundedAmount * getTradeDirection(trade.position);
      const targetAmount = traderState.marginAccountPositionBC + amountChange;

      let newTrade = { ...trade, amount: toWei(roundedAmount.toString()) };

      if (!isNewTrade) {
        newTrade.leverage = calculateLeverage(
          targetAmount,
          traderState.availableCashCC,
          traderState,
          ammState,
          perpParameters,
        );
      } else {
        const maxLeverage = getMaxInitialLeverage(targetAmount, perpParameters);
        newTrade.leverage = Math.min(maxLeverage, newTrade.leverage);
      }

      onChange(newTrade);
    },
    [
      onChange,
      trade,
      lotSize,
      maxTradeSize,
      isNewTrade,
      traderState,
      ammState,
      perpParameters,
    ],
  );
  const onBlurOrderAmount = useCallback(() => {
    setAmount(fromWei(trade.amount));
  }, [trade.amount]);

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

  const pair = useMemo(() => PerpetualPairDictionary.get(trade.pairType), [
    trade.pairType,
  ]);

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

  const requiredCollateral = useMemo(() => {
    const amount = getSignedAmount(trade.position, trade.amount);
    return getRequiredMarginCollateral(
      trade.leverage,
      traderState.marginAccountPositionBC + amount,
      perpParameters,
      ammState,
      traderState,
      trade.slippage,
    );
  }, [perpParameters, ammState, traderState, trade]);

  const maxLeverage = useMemo(
    () =>
      getMaxInitialLeverage(
        getSignedAmount(trade.position, trade.amount),
        perpParameters,
      ),
    [trade.position, trade.amount, perpParameters],
  );

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

  const validation = useMemo(() => {
    const signedAmount = getSignedAmount(trade.position, trade.amount);
    const marginChange = isNewTrade
      ? getRequiredMarginCollateral(
          trade.leverage,
          signedAmount,
          perpParameters,
          ammState,
          traderState,
          trade.slippage,
        )
      : 0;
    return signedAmount !== 0 || marginChange !== 0
      ? validatePositionChange(
          signedAmount,
          marginChange,
          trade.slippage,
          traderState,
          perpParameters,
          ammState,
        )
      : undefined;
  }, [isNewTrade, trade, traderState, perpParameters, ammState]);

  const buttonDisabled = useMemo(
    () =>
      disabled ||
      Number(amount) <= 0 ||
      (validation && !validation.valid && !validation.isWarning),
    [disabled, amount, validation],
  );

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
          // disabled={!validate || !connected || openTradesLocked}
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
          // disabled={!validate || !connected || openTradesLocked}
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
        <label>
          {t(translations.perpetualPage.tradeForm.labels.orderValue)}
        </label>
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
        <label>
          {t(translations.perpetualPage.tradeForm.labels.orderCost)}
        </label>
        <AssetValue
          minDecimals={4}
          maxDecimals={4}
          mode={AssetValueMode.auto}
          value={requiredCollateral}
          assetString={pair.baseAsset}
        />
      </div>
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-4 tw-text-xs tw-font-medium">
        <label>
          {t(translations.perpetualPage.tradeForm.labels.tradingFee)}
        </label>
        <AssetValue
          minDecimals={4}
          maxDecimals={6}
          mode={AssetValueMode.auto}
          value={tradingFee}
          assetString={pair.baseAsset}
        />
      </div>
      {isNewTrade && (
        <LeverageSelector
          className="tw-mb-2"
          value={trade.leverage}
          min={pair.config.leverage.min}
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
      {!isNewTrade && (
        <>
          <LeverageViewer
            className="tw-mt-3"
            label={t(translations.perpetualPage.tradeForm.labels.leverage)}
            min={pair.config.leverage.min}
            max={maxLeverage}
            value={trade.leverage}
            valueLabel={`${toNumberFormat(trade.leverage, 2)}x`}
          />
          <div className="tw-flex tw-flex-row tw-justify-between tw-px-6 tw-py-1 tw-mt-4 tw-text-xs tw-font-medium tw-border tw-border-gray-5 tw-rounded-lg">
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
              {weiToNumberFormat(trade.amount, lotPrecision)}
              {` @ ${trade.position === TradingPosition.LONG ? '≤' : '≥'} `}
              {toNumberFormat(limitPrice, 2)}
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
