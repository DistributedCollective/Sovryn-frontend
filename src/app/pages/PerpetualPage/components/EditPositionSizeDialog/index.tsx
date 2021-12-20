import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { Dialog } from '../../../../containers/Dialog';
import { TransitionAnimation } from '../../../../containers/TransitionContainer';
import { TransitionSteps } from '../../../../containers/TransitionSteps';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import {
  isPerpetualTrade,
  PerpetualPageModals,
  PerpetualTrade,
  PERPETUAL_SLIPPAGE_DEFAULT,
  PerpetualTradeType,
} from '../../types';
import { TradeDetails } from '../TradeDetails';
import { SlippageFormStep } from './components/SlippageFormStep';
import { TradeFormStep } from './components/TradeFormStep';
import {
  EditPositionSizeDialogState,
  EditPositionSizeDialogStep,
} from './types';
import { noop } from '../../../../constants';
import { Asset } from '../../../../../types';
import { TradingPosition } from '../../../../../types/trading-position';

const steps = {
  [EditPositionSizeDialogStep.slippage]: SlippageFormStep,
  [EditPositionSizeDialogStep.trade]: TradeFormStep,
};

export const EditPositionSizeDialogContext = React.createContext<
  EditPositionSizeDialogState
>({ pairType: PerpetualPairType.BTCUSD, onChange: noop });

export const EditPositionSizeDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { modal, modalOptions } = useSelector(selectPerpetualPage);
  const trade = useMemo(
    () => (isPerpetualTrade(modalOptions) ? modalOptions : undefined),
    [modalOptions],
  );
  const pair = useMemo(
    () => trade?.pairType && PerpetualPairDictionary.get(trade.pairType),
    [trade],
  );

  const [changedTrade, setChangedTrade] = useState<PerpetualTrade>({
    pairType: trade?.pairType || PerpetualPairType.BTCUSD,
    tradeType: trade?.tradeType || PerpetualTradeType.MARKET,
    collateral: trade?.collateral || Asset.PERPETUALS,
    position: trade?.position || TradingPosition.LONG,
    slippage: trade?.slippage || PERPETUAL_SLIPPAGE_DEFAULT,
    leverage: trade?.leverage || 0,
    amount: '0',
    entryPrice: 0,
  });

  const context: EditPositionSizeDialogState = useMemo(() => {
    return {
      pairType: changedTrade.pairType,
      trade,
      changedTrade,
      onChange: setChangedTrade,
    };
  }, [trade, changedTrade]);

  const onClose = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.NONE)),
    [dispatch],
  );

  useEffect(
    () =>
      trade &&
      setChangedTrade(changedTrade => ({
        ...changedTrade,
        pairType: trade?.pairType || PerpetualPairType.BTCUSD,
        tradeType: trade?.tradeType || PerpetualTradeType.MARKET,
        collateral: trade?.collateral || Asset.PERPETUALS,
        position: trade?.position || TradingPosition.LONG,
        slippage: trade?.slippage || PERPETUAL_SLIPPAGE_DEFAULT,
        leverage: trade?.leverage || 0,
      })),
    [trade],
  );

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.EDIT_POSITION_SIZE}
      onClose={onClose}
    >
      <h1>{t(translations.perpetualPage.editPositionSize.title)}</h1>
      <EditPositionSizeDialogContext.Provider value={context}>
        {trade && pair && (
          <TradeDetails
            className="tw-mw-340 tw-mx-auto tw-mb-4"
            trade={trade}
            pair={pair}
          />
        )}
        <TransitionSteps<EditPositionSizeDialogStep>
          classNameInner="tw-h-96"
          steps={steps}
          active={EditPositionSizeDialogStep.trade}
          defaultAnimation={TransitionAnimation.slideLeft}
        />
      </EditPositionSizeDialogContext.Provider>
    </Dialog>
  );
};
