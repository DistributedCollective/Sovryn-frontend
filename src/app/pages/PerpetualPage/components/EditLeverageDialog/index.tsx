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
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { Dialog } from '../../../../containers/Dialog';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { isPerpetualTrade, PerpetualPageModals } from '../../types';
import { TradeDetails } from '../TradeDetails';
import { LeverageSelector } from '../LeverageSelector';
import { AssetValue } from '../../../../components/AssetValue';
import { AssetValueMode } from '../../../../components/AssetValue/types';
import {
  getRequiredMarginCollateral,
  calculateApproxLiquidationPrice,
  getMaxInitialLeverage,
} from '../../utils/perpUtils';
import { toWei } from '../../../../../utils/blockchain/math-helpers';
import { PerpetualTxMethods } from '../TradeDialog/types';
import { PerpetualQueriesContext } from '../../contexts/PerpetualQueriesContext';
import {
  getSignedAmount,
  validatePositionChange,
} from '../../utils/contractUtils';
import { ActionDialogSubmitButton } from '../ActionDialogSubmitButton';
import { usePerpetual_isTradingInMaintenance } from '../../hooks/usePerpetual_isTradingInMaintenance';

export const EditLeverageDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { modal, modalOptions } = useSelector(selectPerpetualPage);

  const inMaintenance = usePerpetual_isTradingInMaintenance();

  const {
    ammState,
    traderState,
    perpetualParameters: perpParameters,
  } = useContext(PerpetualQueriesContext);

  const trade = useMemo(
    () => (isPerpetualTrade(modalOptions) ? modalOptions : undefined),
    [modalOptions],
  );
  const pair = useMemo(
    () => trade?.pairType && PerpetualPairDictionary.get(trade.pairType),
    [trade],
  );

  const maxLeverage = useMemo(
    () =>
      trade
        ? getMaxInitialLeverage(
            getSignedAmount(trade.position, trade.amount),
            perpParameters,
          )
        : pair?.config.leverage.max || 15,
    [trade, perpParameters, pair],
  );

  const [changedTrade, setChangedTrade] = useState(trade);
  const [margin, setMargin] = useState(0);
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
  }, [changedTrade, margin, traderState, ammState, perpParameters]);

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
        trade: { ...changedTrade, leverage },
        transactions: [
          marginChange >= 0
            ? {
                pair: pair?.pairType || PerpetualPairType.BTCUSD,
                method: PerpetualTxMethods.deposit,
                amount: toWei(marginChange),
                target: {
                  leverage: changedTrade.leverage,
                },
                approvalTx: null,
                tx: null,
                origin: PerpetualPageModals.EDIT_LEVERAGE,
              }
            : {
                pair: pair?.pairType || PerpetualPairType.BTCUSD,
                method: PerpetualTxMethods.withdraw,
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
  }, [
    dispatch,
    changedTrade,
    leverage,
    margin,
    traderState.availableCashCC,
    pair,
  ]);

  const validation = useMemo(() => {
    if (!changedTrade) {
      return;
    }
    const marginChange = margin - traderState.availableCashCC;

    return validatePositionChange(
      0,
      marginChange,
      changedTrade.slippage,
      traderState,
      perpParameters,
      ammState,
    );
  }, [changedTrade, margin, traderState, perpParameters, ammState]);

  const isButtonDisabled = useMemo(
    () =>
      trade?.leverage === changedTrade?.leverage ||
      (validation && !validation.valid && !validation.isWarning),
    [trade?.leverage, changedTrade?.leverage, validation],
  );

  useEffect(() => {
    setChangedTrade(trade);
    setLeverage(Number(trade?.leverage.toFixed(2)));
  }, [trade]);

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.EDIT_LEVERAGE}
      onClose={onClose}
    >
      <h1>{t(translations.perpetualPage.editLeverage.title)}</h1>
      {trade && pair && (
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
          <div className="tw-flex tw-flex-row tw-justify-between tw-mb-4 tw-px-6 tw-py-1 tw-text-xs tw-font-medium tw-border tw-border-gray-5 tw-rounded-lg">
            <label>{t(translations.perpetualPage.editLeverage.margin)}</label>
            <AssetValue
              minDecimals={4}
              maxDecimals={4}
              mode={AssetValueMode.auto}
              value={margin}
              assetString={pair.baseAsset}
            />
          </div>
          <div className="tw-flex tw-flex-row tw-justify-between tw-mb-4 tw-px-6 tw-py-1 tw-text-xs tw-font-medium tw-border tw-border-gray-5 tw-rounded-lg">
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
          {!inMaintenance &&
            validation &&
            !validation.valid &&
            validation.errors.length > 0 && (
              <div className="tw-flex tw-flex-row tw-justify-between tw-px-6 tw-py-1 tw-mb-4 tw-text-warning tw-text-xs tw-font-medium tw-border tw-border-warning tw-rounded-lg">
                {validation.errorMessages}
              </div>
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
