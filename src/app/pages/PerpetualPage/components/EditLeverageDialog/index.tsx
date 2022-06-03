import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useContext,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { PerpetualPairDictionary } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { Dialog } from '../../../../containers/Dialog';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import {
  PerpetualTxMethod,
  isPerpetualTrade,
  PerpetualPageModals,
  PERPETUAL_MAX_LEVERAGE_DEFAULT,
} from '../../types';
import { TradeDetails } from '../TradeDetails';
import { LeverageSelector } from '../LeverageSelector';
import { AssetValue } from '../../../../components/AssetValue';
import { AssetValueMode } from '../../../../components/AssetValue/types';
import {
  toWei,
  numberFromWei,
} from '../../../../../utils/blockchain/math-helpers';
import { PerpetualQueriesContext } from '../../contexts/PerpetualQueriesContext';
import {
  getSignedAmount,
  validatePositionChange,
  getTradeDirection,
} from '../../utils/contractUtils';
import { ActionDialogSubmitButton } from '../ActionDialogSubmitButton';
import { usePerpetual_isTradingInMaintenance } from '../../hooks/usePerpetual_isTradingInMaintenance';
import { usePrevious } from '../../../../hooks/usePrevious';
import { perpUtils } from '@sovryn/perpetual-swap';
import { getCollateralName } from '../../utils/renderUtils';
import { calculateSlippagePrice } from '@sovryn/perpetual-swap/dist/scripts/utils/perpUtils';
import { ValidationHint } from '../ValidationHint/ValidationHint';

const {
  getRequiredMarginCollateral,
  calculateApproxLiquidationPrice,
  getMaxInitialLeverage,
} = perpUtils;

export const EditLeverageDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { pairType: currentPairType, modal, modalOptions } = useSelector(
    selectPerpetualPage,
  );

  const inMaintenance = usePerpetual_isTradingInMaintenance();

  const { perpetuals } = useContext(PerpetualQueriesContext);

  const trade = useMemo(
    () => (isPerpetualTrade(modalOptions) ? modalOptions : undefined),
    [modalOptions],
  );
  const pair = useMemo(
    () => PerpetualPairDictionary.get(trade?.pairType || currentPairType),
    [trade, currentPairType],
  );

  const {
    ammState,
    traderState,
    perpetualParameters: perpParameters,
    availableBalance,
  } = perpetuals[pair.id];

  const collateralName = useMemo(
    () => getCollateralName(pair.collateralAsset),
    [pair.collateralAsset],
  );

  const maxLeverage = useMemo(
    () =>
      trade
        ? getMaxInitialLeverage(
            getSignedAmount(trade.position, trade.amount),
            perpParameters,
          )
        : pair.config.leverage.max || PERPETUAL_MAX_LEVERAGE_DEFAULT,
    [trade, perpParameters, pair],
  );

  const [changedTrade, setChangedTrade] = useState(trade);
  const [margin, setMargin] = useState(traderState.availableCashCC || 0);
  const [leverage, setLeverage] = useState(Number(trade?.leverage.toFixed(2)));
  const onChangeLeverage = useCallback(
    leverage => {
      if (!changedTrade) {
        return;
      }

      const roundedLeverage =
        leverage === maxLeverage ? leverage : Number(leverage.toFixed(2));

      setLeverage(roundedLeverage);

      const margin = getRequiredMarginCollateral(
        roundedLeverage,
        traderState.marginAccountPositionBC,
        perpParameters,
        ammState,
        traderState,
        changedTrade.slippage,
        false,
        true,
      );

      setMargin(margin);

      setChangedTrade({
        ...changedTrade,
        leverage,
        margin: toWei(margin),
      });
    },
    [changedTrade, maxLeverage, traderState, perpParameters, ammState],
  );

  const liquidationPrice = useMemo(() => {
    if (!changedTrade) {
      return 0;
    }

    return calculateApproxLiquidationPrice(
      traderState,
      ammState,
      perpParameters,
      0,
      margin - traderState.availableCashCC,
    );
  }, [changedTrade, traderState, ammState, perpParameters, margin]);

  const onClose = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.NONE)),
    [dispatch],
  );

  const onSubmit = useCallback(() => {
    if (!changedTrade) {
      return;
    }
    const marginChange = margin - traderState.availableCashCC;

    dispatch(
      actions.setModal(PerpetualPageModals.TRADE_REVIEW, {
        origin: PerpetualPageModals.EDIT_LEVERAGE,
        trade: {
          ...changedTrade,
          amount: '0',
          margin: toWei(marginChange),
          leverage: Number.NaN,
        },
        transactions: [
          marginChange >= 0
            ? {
                pair: pair.pairType,
                method: PerpetualTxMethod.deposit,
                amount: toWei(marginChange),
                target: {
                  leverage: changedTrade.leverage,
                },
                approvalTx: null,
                tx: null,
                origin: PerpetualPageModals.EDIT_LEVERAGE,
              }
            : {
                pair: pair.pairType,
                method: PerpetualTxMethod.withdraw,
                amount: toWei(Math.abs(marginChange)),
                target: {
                  leverage: changedTrade.leverage,
                },
                tx: null,
                origin: PerpetualPageModals.EDIT_LEVERAGE,
              },
        ],
      }),
    );
  }, [dispatch, changedTrade, margin, traderState.availableCashCC, pair]);

  const validation = useMemo(() => {
    if (!changedTrade) {
      return;
    }
    const marginChange = margin - traderState.availableCashCC;

    return validatePositionChange(
      {
        amountChange: 0,
        marginChange,
        orderCost: Math.max(marginChange, 0),
        limitPrice: calculateSlippagePrice(
          changedTrade.averagePrice
            ? numberFromWei(changedTrade.averagePrice)
            : 0,
          changedTrade.slippage,
          getTradeDirection(changedTrade.position),
        ),
      },
      numberFromWei(availableBalance),
      traderState,
      perpParameters,
      ammState,
    );
  }, [
    changedTrade,
    margin,
    availableBalance,
    traderState,
    perpParameters,
    ammState,
  ]);

  const isButtonDisabled = useMemo(
    () =>
      trade?.leverage === changedTrade?.leverage ||
      (validation && !validation.valid && !validation.isWarning),
    [trade?.leverage, changedTrade?.leverage, validation],
  );

  const previousChangedTrade = usePrevious(changedTrade);

  useEffect(() => {
    setChangedTrade(trade);
  }, [trade]);

  useEffect(() => {
    if (previousChangedTrade?.id !== changedTrade?.id) {
      onChangeLeverage(changedTrade?.leverage);
    }
  }, [previousChangedTrade, changedTrade, onChangeLeverage]);

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.EDIT_LEVERAGE}
      onClose={onClose}
    >
      <h1>{t(translations.perpetualPage.editLeverage.title)}</h1>
      {trade && (
        <div className="tw-mw-340 tw-mx-auto">
          <TradeDetails
            className="tw-mw-340 tw-mx-auto tw-mb-4"
            trade={trade}
            pair={pair}
          />
          <LeverageSelector
            className="tw-mb-6"
            min={pair.config.leverage.min}
            max={maxLeverage}
            steps={pair.config.leverage.steps}
            value={leverage}
            onChange={onChangeLeverage}
          />
          <div className="tw-flex tw-flex-col tw-justify-between tw-mb-4 tw-px-6 tw-py-1.5 tw-text-xs tw-font-medium tw-border tw-border-gray-5 tw-rounded-lg">
            <div className="tw-flex tw-justify-between">
              <label>{t(translations.perpetualPage.editLeverage.margin)}</label>
              <AssetValue
                minDecimals={4}
                maxDecimals={4}
                mode={AssetValueMode.auto}
                value={margin}
                assetString={collateralName}
              />
            </div>

            <div className="tw-flex tw-justify-between tw-mt-1.5">
              <label>
                {t(translations.perpetualPage.editLeverage.liquidation)}
              </label>
              <AssetValue
                minDecimals={2}
                maxDecimals={2}
                mode={AssetValueMode.auto}
                value={liquidationPrice}
                assetString={pair.quoteAsset}
              />
            </div>
          </div>
          {!inMaintenance && (
            <ValidationHint className="tw-mb-4" validation={validation} />
          )}

          <ActionDialogSubmitButton
            inMaintenance={inMaintenance}
            isDisabled={isButtonDisabled}
            onClick={onSubmit}
          >
            {t(translations.perpetualPage.editLeverage.button)}
          </ActionDialogSubmitButton>
        </div>
      )}
    </Dialog>
  );
};
