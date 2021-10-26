import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { Dialog } from '../../../../containers/Dialog';
import { TransitionAnimation } from '../../../../containers/TransitionContainer';
import { TransitionSteps } from '../../../../containers/TransitionSteps';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { PerpetualPageModals } from '../../types';
import { SlippageFormStep } from './components/SlippageFormStep';
import { TradeFormStep } from './components/TradeFormStep';
import { EditPositionSizeDialogStep } from './types';

const steps = {
  [EditPositionSizeDialogStep.slippage]: SlippageFormStep,
  [EditPositionSizeDialogStep.trade]: TradeFormStep,
};

export const EditPositionSizeDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { modal } = useSelector(selectPerpetualPage);

  const onClose = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.NONE)),
    [dispatch],
  );

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.EDIT_POSITION_SIZE}
      onClose={onClose}
    >
      <h1>{t(translations.perpetualPage.editPositionSize.title)}</h1>
      <TransitionSteps<EditPositionSizeDialogStep>
        classNameInner="tw-px-16"
        steps={steps}
        active={EditPositionSizeDialogStep.trade}
        defaultAnimation={TransitionAnimation.slideLeft}
      />
    </Dialog>
  );
};
