import React, { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { Dialog } from '../../../../containers/Dialog';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { PerpetualPageModals, isPerpetualTradeReview } from '../../types';
import { usePerpetual_openTrade } from '../../hooks/usePerpetual_openTrade';
import styles from './index.module.scss';
import classNames from 'classnames';
import { TradingPosition } from 'types/trading-position';
import { fromWei } from 'web3-utils';
import { usePerpetual_queryPerpParameters } from '../../hooks/usePerpetual_queryPerpParameters';
import {
  calculateApproxLiquidationPrice,
  getRequiredMarginCollateral,
  getTradingFee,
  calculateLeverage,
} from '../../utils/perpUtils';
import { toNumberFormat } from 'utils/display-text/format';
import { usePerpetual_marginAccountBalance } from '../../hooks/usePerpetual_marginAccountBalance';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from 'utils/dictionaries/perpetual-pair-dictionary';
import { usePerpetual_queryAmmState } from '../../hooks/usePerpetual_queryAmmState';
import { getTradeDirection } from '../../utils/contractUtils';
import { usePerpetual_queryTraderState } from '../../hooks/usePerpetual_queryTraderState';

type TradeAnalysis = {
  amountChange: number;
  amountTarget: number;
  marginChange: number;
  marginTarget: number;
  leverageTarget: number;
  entryPrice: number;
  liquidationPrice: number;
  tradingFee: number;
};

const titleMap = {
  [PerpetualPageModals.NONE]:
    translations.perpetualPage.reviewTrade.titles.newOrder,
  [PerpetualPageModals.EDIT_POSITION_SIZE]:
    translations.perpetualPage.reviewTrade.titles.newOrder,
  [PerpetualPageModals.EDIT_LEVERAGE]:
    translations.perpetualPage.reviewTrade.titles.editLeverage,
  [PerpetualPageModals.EDIT_MARGIN]:
    translations.perpetualPage.reviewTrade.titles.editMargin,
  [PerpetualPageModals.CLOSE_POSITION]:
    translations.perpetualPage.reviewTrade.titles.close,
};

const getTradePosition = (tradePosition: TradingPosition) =>
  tradePosition === TradingPosition.LONG ? (
    <Trans i18nKey={translations.perpetualPage.reviewTrade.buy} />
  ) : (
    <Trans i18nKey={translations.perpetualPage.reviewTrade.sell} />
  );

export const TradeReviewDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { modal, modalOptions } = useSelector(selectPerpetualPage);

  const marginAccountBalance = usePerpetual_marginAccountBalance();
  const perpParameters = usePerpetual_queryPerpParameters();
  const ammState = usePerpetual_queryAmmState();
  const traderState = usePerpetual_queryTraderState();

  const { trade: openTrade } = usePerpetual_openTrade();

  const { origin, trade } = useMemo(
    () =>
      isPerpetualTradeReview(modalOptions)
        ? modalOptions
        : { origin: undefined, trade: undefined },
    [modalOptions],
  );

  const pair = useMemo(
    () =>
      PerpetualPairDictionary.get(trade?.pairType || PerpetualPairType.BTCUSD),
    [trade],
  );

  const {
    amountChange,
    amountTarget,
    marginChange,
    marginTarget,
    leverageTarget,
    entryPrice,
    liquidationPrice,
    tradingFee,
  }: TradeAnalysis = useMemo(() => {
    if (!trade) {
      return {
        amountChange: 0,
        amountTarget: 0,
        marginChange: 0,
        marginTarget: 0,
        leverageTarget: 0,
        entryPrice: 0,
        liquidationPrice: 0,
        tradingFee: 0,
      };
    }

    let amountTarget =
      Number(fromWei(trade.amount)) * getTradeDirection(trade.position);
    let amountChange = amountTarget - traderState.marginAccountPositionBC;

    let marginTarget = trade.margin
      ? Number(fromWei(trade.margin))
      : traderState.availableCashCC +
        getRequiredMarginCollateral(
          trade.leverage,
          traderState.marginAccountPositionBC,
          amountTarget,
          perpParameters,
          ammState,
        );
    let marginChange = marginTarget - traderState.availableCashCC;

    const leverageTarget = calculateLeverage(
      amountTarget,
      marginTarget,
      ammState,
    );

    const liquidationPrice = calculateApproxLiquidationPrice(
      traderState,
      ammState,
      perpParameters,
      amountChange,
      marginChange,
    );

    const tradingFee = getTradingFee(amountChange, perpParameters);

    console.log(trade, {
      amountChange,
      amountTarget,
      marginChange,
      marginTarget,
      leverageTarget,
      liquidationPrice,
      tradingFee,
      entryPrice: trade.entryPrice,
    });

    return {
      amountChange,
      amountTarget,
      marginChange,
      marginTarget,
      leverageTarget,
      liquidationPrice,
      tradingFee,
      entryPrice: trade.entryPrice,
    };
  }, [trade, traderState, perpParameters, ammState]);

  const isBuy = useMemo(() => trade?.position === TradingPosition.LONG, [
    trade?.position,
  ]);

  const onClose = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.NONE)),
    [dispatch],
  );

  const onSubmit = useCallback(
    () =>
      trade &&
      openTrade(
        false,
        trade?.amount,
        trade.leverage,
        trade.slippage,
        trade.position,
      ),
    [openTrade, trade],
  );

  if (!trade) {
    return null;
  }

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.TRADE_REVIEW}
      onClose={onClose}
    >
      <h1 className="tw-font-semibold">{origin && t(titleMap[origin])}</h1>
      <div className={styles.contentWrapper}>
        <div className="tw-w-full tw-p-4 tw-bg-gray-2 tw-flex tw-flex-col tw-items-center tw-rounded-xl">
          <div
            className={classNames(
              'tw-text-xl tw-font-semibold tw-tracking-normal tw-leading-none',
              isBuy ? styles.orderActionBuy : styles.orderActionSell,
            )}
          >
            {toNumberFormat(leverageTarget, 2)}x{' '}
            {t(translations.perpetualPage.reviewTrade.market)}{' '}
            {getTradePosition(trade?.position)}
          </div>
          <div className="tw-text-sm tw-tracking-normal tw-mt-2 tw-leading-none tw-text-sov-white tw-font-medium">
            {toNumberFormat(amountChange, 3)} {pair.baseAsset} @{' '}
            {isBuy ? '≥' : '≤'} {toNumberFormat(entryPrice, 2)}{' '}
            {pair.quoteAsset}
          </div>
        </div>

        <div className="tw-w-full tw-p-4 tw-bg-gray-2 tw-flex tw-flex-col tw-items-center tw-rounded-xl tw-mt-4">
          <div className={styles.tradingFeeWrapper}>
            <span className="tw-text-gray-10">
              {t(translations.perpetualPage.tradeForm.labels.tradingFee)}
            </span>
            <span className="tw-text-sov-white tw-font-medium">
              <AssetValue
                minDecimals={0}
                maxDecimals={6}
                mode={AssetValueMode.auto}
                value={String(tradingFee)}
                assetString={pair.baseAsset}
              />
            </span>
          </div>
        </div>

        <div className="tw-text-sm tw-mt-6 tw-mb-2 tw-text-center tw-text-sov-white tw-font-medium">
          {t(translations.perpetualPage.reviewTrade.positionDetailsTitle)}
        </div>

        <div className="tw-w-full tw-p-4 tw-bg-gray-5 tw-flex tw-flex-col tw-items-center tw-rounded-xl">
          <div className={styles.positionInfoRow}>
            <span className="tw-text-gray-10">
              {t(translations.perpetualPage.reviewTrade.labels.positionSize)}
            </span>
            <span
              className={
                amountTarget > 0
                  ? styles.positionSizeBuy
                  : styles.positionSizeSell
              }
            >
              <AssetValue
                minDecimals={3}
                maxDecimals={3}
                mode={AssetValueMode.auto}
                value={amountTarget}
                assetString={pair.baseAsset}
                showPositiveSign
              />
            </span>
          </div>

          <div className={classNames(styles.positionInfoRow, 'tw-mt-2')}>
            <span className="tw-text-gray-10">
              {t(translations.perpetualPage.reviewTrade.labels.margin)}
            </span>
            <span className="tw-font-medium">
              <AssetValue
                minDecimals={4}
                maxDecimals={4}
                mode={AssetValueMode.auto}
                value={marginTarget}
                assetString={pair.baseAsset}
              />
            </span>
          </div>

          <div className={classNames(styles.positionInfoRow, 'tw-mt-2')}>
            <span className="tw-text-gray-10">
              {t(translations.perpetualPage.reviewTrade.labels.leverage)}
            </span>
            <span className="tw-font-medium">
              {toNumberFormat(leverageTarget, 2)}x
            </span>
          </div>
          {amountChange !== 0 && (
            <div className={classNames(styles.positionInfoRow, 'tw-mt-2')}>
              <span className="tw-text-gray-10">
                {t(translations.perpetualPage.reviewTrade.labels.entryPrice)}
              </span>
              <span className="tw-font-medium">
                {amountChange > 0 ? '≥ ' : '≤ '}
                <AssetValue
                  minDecimals={2}
                  maxDecimals={2}
                  mode={AssetValueMode.auto}
                  value={entryPrice}
                  assetString={pair.quoteAsset}
                />
              </span>
            </div>
          )}

          <div className={classNames(styles.positionInfoRow, 'tw-mt-2')}>
            <span className="tw-text-gray-10 tw-font-semibold">
              {t(
                translations.perpetualPage.reviewTrade.labels.liquidationPrice,
              )}
            </span>
            <span className="tw-font-semibold">
              <AssetValue
                minDecimals={2}
                maxDecimals={2}
                mode={AssetValueMode.auto}
                value={liquidationPrice}
                assetString={pair.quoteAsset}
              />
            </span>
          </div>
        </div>

        <div className="tw-flex tw-justify-center">
          <button className={styles.confirmButton} onClick={onSubmit}>
            {t(translations.perpetualPage.reviewTrade.confirm)}
          </button>
        </div>
      </div>
    </Dialog>
  );
};
