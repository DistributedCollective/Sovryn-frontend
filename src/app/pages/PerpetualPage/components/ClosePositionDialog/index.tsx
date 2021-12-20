import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { PerpetualPairDictionary } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { Dialog } from '../../../../containers/Dialog';
import { TransitionAnimation } from '../../../../containers/TransitionContainer';
import { TransitionSteps } from '../../../../containers/TransitionSteps';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { isPerpetualTrade, PerpetualPageModals } from '../../types';
import { TradeDetails } from '../TradeDetails';
import { SlippageFormStep } from './components/SlippageFormStep';
import { TradeFormStep } from './components/TradeFormStep';
import { ClosePositionDialogState, ClosePositionDialogStep } from './types';
import { noop } from '../../../../constants';
import { generateCloseTrade } from './utils';

const steps = {
  [ClosePositionDialogStep.slippage]: SlippageFormStep,
  [ClosePositionDialogStep.trade]: TradeFormStep,
};

export const ClosePositionDialogContext = React.createContext<
  ClosePositionDialogState
>({ onChange: noop });
export const ClosePositionDialog: React.FC = () => {
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

  const [changedTrade, setChangedTrade] = useState(
    trade && generateCloseTrade(trade),
  );

  const context: ClosePositionDialogState = useMemo(() => {
    return {
      trade,
      changedTrade,
      onChange: setChangedTrade,
    };
  }, [trade, changedTrade]);

  const onClose = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.NONE)),
    [dispatch],
  );

  useEffect(() => setChangedTrade(trade && generateCloseTrade(trade)), [trade]);

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.CLOSE_POSITION}
      onClose={onClose}
    >
      <h1>{t(translations.perpetualPage.closePosition.title)}</h1>
      <ClosePositionDialogContext.Provider value={context}>
        {trade && pair && (
          <TradeDetails
            className="tw-mw-340 tw-mx-auto tw-mb-4"
            trade={trade}
            pair={pair}
            showUnrealizedPnL
          />
        )}
        <TransitionSteps<ClosePositionDialogStep>
          classNameInner="tw-min-h-96"
          steps={steps}
          active={ClosePositionDialogStep.trade}
          defaultAnimation={TransitionAnimation.slideLeft}
        />
      </ClosePositionDialogContext.Provider>
    </Dialog>
  );
};
