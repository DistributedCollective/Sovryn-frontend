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
import { isPerpetualTrade, PerpetualPageModals } from '../../types';
import { TradeDetails } from '../TradeDetails';
import { AssetValue } from '../../../../components/AssetValue';
import { AssetValueMode } from '../../../../components/AssetValue/types';
import { fromWei } from 'web3-utils';
import classNames from 'classnames';
import { LeverageViewer } from '../LeverageViewer';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { AmountInput } from '../../../../components/Form/AmountInput';
import {
  validatePositionChange,
  getTradeDirection,
} from '../../utils/contractUtils';
import {
  toWei,
  numberFromWei,
} from '../../../../../utils/blockchain/math-helpers';
import { PerpetualTxMethod } from '../../types';
import { PerpetualQueriesContext } from '../../contexts/PerpetualQueriesContext';
import { ActionDialogSubmitButton } from '../ActionDialogSubmitButton';
import { usePerpetual_isTradingInMaintenance } from '../../hooks/usePerpetual_isTradingInMaintenance';
import { getCollateralName } from '../../utils/renderUtils';
import { perpUtils } from '@sovryn/perpetual-swap';
import { calculateSlippagePrice } from '@sovryn/perpetual-swap/dist/scripts/utils/perpUtils';
import { ValidationHint } from '../ValidationHint/ValidationHint';

const {
  calculateApproxLiquidationPrice,
  calculateLeverage,
  getMaximalMarginToWithdraw,
} = perpUtils;

enum EditMarginDialogMode {
  increase,
  decrease,
}

export const EditMarginDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    pairType: currentPairType,
    collateral,
    modal,
    modalOptions,
  } = useSelector(selectPerpetualPage);

  const inMaintenance = usePerpetual_isTradingInMaintenance();

  const { perpetuals } = useContext(PerpetualQueriesContext);

  const collateralName = useMemo(() => getCollateralName(collateral), [
    collateral,
  ]);

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

  const [mode, setMode] = useState(EditMarginDialogMode.increase);
  const onSelectIncrease = useCallback(
    () => setMode(EditMarginDialogMode.increase),
    [],
  );
  const onSelectDecrease = useCallback(
    () => setMode(EditMarginDialogMode.decrease),
    [],
  );

  const [margin, setMargin] = useState('0');
  const [changedTrade, setChangedTrade] = useState(trade);

  const signedMargin = useMemo(
    () => (mode === EditMarginDialogMode.increase ? 1 : -1) * Number(margin),
    [mode, margin],
  );

  const onClose = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.NONE)),
    [dispatch],
  );

  const onSubmit = useCallback(
    () =>
      changedTrade &&
      dispatch(
        actions.setModal(PerpetualPageModals.TRADE_REVIEW, {
          origin: PerpetualPageModals.EDIT_MARGIN,
          trade: {
            ...changedTrade,
            amount: '0',
            margin: toWei(signedMargin),
            leverage: NaN,
          },
          transactions: [
            signedMargin >= 0
              ? {
                  pair: pair.pairType,
                  method: PerpetualTxMethod.deposit,
                  amount: toWei(signedMargin),
                  approvalTx: null,
                  tx: null,
                  origin: PerpetualPageModals.EDIT_MARGIN,
                }
              : {
                  pair: pair.pairType,
                  method: PerpetualTxMethod.withdraw,
                  amount: toWei(-signedMargin),
                  tx: null,
                  origin: PerpetualPageModals.EDIT_MARGIN,
                },
          ],
        }),
      ),
    [dispatch, changedTrade, signedMargin, pair],
  );

  const [maxAmount, maxAmountWei] = useMemo(() => {
    if (mode === EditMarginDialogMode.increase) {
      // Fees don't need to be subtracted, since Collateral is not paid with the Network Token
      return [Number(fromWei(availableBalance)), availableBalance];
    } else {
      const maxAmount = getMaximalMarginToWithdraw(
        traderState,
        perpParameters,
        ammState,
      );
      return [maxAmount, toWei(maxAmount)];
    }
  }, [mode, availableBalance, traderState, perpParameters, ammState]);

  const onChangeMargin = useCallback(
    (value?: string) => {
      const clampedMargin = Math.max(
        0,
        Math.min(maxAmount, value ? Number(value) : Math.abs(signedMargin)),
      );
      setMargin(clampedMargin.toPrecision(8));

      const newMargin = traderState.availableCashCC + signedMargin;
      const leverage = calculateLeverage(
        traderState.marginAccountPositionBC,
        newMargin,
        traderState,
        ammState,
        perpParameters,
      );

      setChangedTrade(
        changedTrade =>
          changedTrade && {
            ...changedTrade,
            leverage,
            margin: toWei(newMargin),
          },
      );
    },
    [signedMargin, maxAmount, traderState, ammState, perpParameters],
  );

  const liquidationPrice = useMemo(
    () =>
      calculateApproxLiquidationPrice(
        traderState,
        ammState,
        perpParameters,
        0,
        signedMargin,
      ),
    [signedMargin, traderState, ammState, perpParameters],
  );

  const validation = useMemo(() => {
    if (!changedTrade) {
      return;
    }
    return validatePositionChange(
      {
        amountChange: 0,
        marginChange: signedMargin,
        orderCost: Math.max(signedMargin, 0),
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
    signedMargin,
    availableBalance,
    traderState,
    perpParameters,
    ammState,
  ]);

  const isButtonDisabled = useMemo(
    () =>
      Number(margin) === 0 ||
      (validation && !validation.valid && !validation.isWarning),
    [margin, validation],
  );

  useEffect(() => setChangedTrade(trade), [trade]);

  // call onChangeMargin, when it's renewed to enforce maxAmount.
  useEffect(() => onChangeMargin(), [onChangeMargin]);

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.EDIT_MARGIN}
      onClose={onClose}
    >
      <h1>{t(translations.perpetualPage.editMargin.title)}</h1>
      {trade && (
        <div className="tw-mw-340 tw-mx-auto">
          <TradeDetails
            className="tw-mw-340 tw-mx-auto tw-mb-4"
            trade={trade}
            pair={pair}
          />
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-5">
            <button
              className={classNames(
                'tw-w-full tw-h-8 tw-font-semibold tw-text-sm tw-rounded-l-lg tw-bg-secondary tw-border tw-border-secondary tw-transition-colors tw-duration-300',
                mode === EditMarginDialogMode.increase
                  ? 'tw-text-white tw-bg-opacity-50'
                  : 'tw-text-gray-5 tw-bg-opacity-0 hover:tw-text-white hover:tw-bg-opacity-50',
              )}
              onClick={onSelectIncrease}
            >
              {t(translations.perpetualPage.editMargin.increase)}
            </button>
            <button
              className={classNames(
                'tw-w-full tw-h-8 tw-font-semibold tw-text-sm tw-rounded-r-lg tw-bg-secondary tw-border tw-border-secondary tw-transition-colors tw-duration-300',
                mode === EditMarginDialogMode.decrease
                  ? 'tw-text-white tw-bg-opacity-50'
                  : 'tw-text-gray-5 tw-bg-opacity-0 hover:tw-text-white hover:tw-bg-opacity-50',
              )}
              onClick={onSelectDecrease}
            >
              {t(translations.perpetualPage.editMargin.decrease)}
            </button>
          </div>
          <div className="tw-mb-4 tw-text-sm">
            <label>
              {mode === EditMarginDialogMode.increase
                ? t(translations.perpetualPage.editMargin.increaseLabel)
                : t(translations.perpetualPage.editMargin.decreaseLabel)}
            </label>
            <AmountInput
              value={margin}
              maxAmount={maxAmountWei}
              assetString={collateralName}
              decimalPrecision={6}
              step={0.0001}
              onChange={onChangeMargin}
            />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-between tw-px-6 tw-py-1.5 tw-mb-4 tw-text-xs tw-font-medium tw-border tw-border-gray-5 tw-rounded-lg">
            <LeverageViewer
              label={t(translations.perpetualPage.tradeForm.labels.leverage)}
              min={pair.config.leverage.min}
              max={pair.config.leverage.max}
              value={changedTrade?.leverage || 0}
              valueLabel={
                changedTrade && `${toNumberFormat(changedTrade.leverage, 2)}x`
              }
            />

            <div className="tw-flex tw-justify-between tw-mt-1.5">
              <label>
                {t(
                  translations.perpetualPage.tradeForm.labels.liquidationPrice,
                )}
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

          <ValidationHint className="tw-mb-4" validation={validation} />

          <ActionDialogSubmitButton
            inMaintenance={inMaintenance}
            isDisabled={isButtonDisabled}
            onClick={onSubmit}
          >
            {t(translations.perpetualPage.editMargin.button)}
          </ActionDialogSubmitButton>
        </div>
      )}
    </Dialog>
  );
};
