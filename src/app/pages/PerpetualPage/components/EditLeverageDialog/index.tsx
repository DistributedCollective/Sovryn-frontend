import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { PerpetualPairDictionary } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
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
} from '../../utils/perpUtils';
import { getTradeDirection } from '../../utils/contractUtils';
import { fromWei, toWei } from 'web3-utils';
import { usePerpetual_queryPerpParameters } from '../../hooks/usePerpetual_queryPerpParameters';
import { usePerpetual_queryAmmState } from '../../hooks/usePerpetual_queryAmmState';
import { usePerpetual_queryTraderState } from '../../hooks/usePerpetual_queryTraderState';

export const EditLeverageDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { modal, modalOptions } = useSelector(selectPerpetualPage);
  const traderState = usePerpetual_queryTraderState();
  const ammState = usePerpetual_queryAmmState();
  const perpParameters = usePerpetual_queryPerpParameters();
  const trade = useMemo(
    () => (isPerpetualTrade(modalOptions) ? modalOptions : undefined),
    [modalOptions],
  );
  const pair = useMemo(
    () => trade?.pairType && PerpetualPairDictionary.get(trade.pairType),
    [trade],
  );

  const [changedTrade, setChangedTrade] = useState(trade);
  const [margin, setMargin] = useState(0);
  const onChangeLeverage = useCallback(
    leverage => {
      if (!changedTrade) {
        return;
      }

      const margin = getRequiredMarginCollateral(
        leverage,
        traderState.marginAccountPositionBC,
        traderState.marginAccountPositionBC,
        perpParameters,
        ammState,
      );
      setMargin(margin);
      setChangedTrade({
        ...changedTrade,
        leverage,
        margin: toWei(margin.toPrecision(8)),
      });
    },
    [changedTrade, traderState, perpParameters, ammState],
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

  const onSubmit = useCallback(
    () =>
      dispatch(
        actions.setModal(PerpetualPageModals.TRADE_REVIEW, {
          origin: PerpetualPageModals.EDIT_LEVERAGE,
          trade: changedTrade,
        }),
      ),
    [dispatch, changedTrade],
  );

  useEffect(() => setChangedTrade(trade), [trade]);

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
            max={pair.config.leverage.max}
            steps={pair.config.leverage.steps}
            value={changedTrade?.leverage || 0}
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
          <div className="tw-flex tw-flex-row tw-justify-between tw-mb-8 tw-px-6 tw-py-1 tw-text-xs tw-font-medium tw-border tw-border-gray-5 tw-rounded-lg">
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
          <button
            className="tw-w-full tw-min-h-10 tw-p-2 tw-text-lg tw-text-primary tw-font-medium tw-border tw-border-primary tw-bg-primary-10 tw-rounded-lg tw-transition-colors tw-duration-300 hover:tw-bg-primary-25"
            onClick={onSubmit}
          >
            {t(translations.perpetualPage.editLeverage.button)}
          </button>
        </div>
      )}
    </Dialog>
  );
};
