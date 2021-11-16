import React, { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import iconArrowForward from 'assets/images/arrow_forward.svg';
import { SlippageForm } from '../../SlippageForm';
import { ClosePositionDialogStep } from '../types';
import { TransitionAnimation } from '../../../../../containers/TransitionContainer';
import { translations } from '../../../../../../locales/i18n';
import { ClosePositionDialogContext } from '..';
import { PERPETUAL_SLIPPAGE_DEFAULT } from '../../../types';

export const SlippageFormStep: TransitionStep<ClosePositionDialogStep> = ({
  changeTo,
}) => {
  const { t } = useTranslation();

  const { changedTrade, onChange } = useContext(ClosePositionDialogContext);

  const onCloseSlippage = useCallback(
    () =>
      changeTo(ClosePositionDialogStep.trade, TransitionAnimation.slideRight),
    [changeTo],
  );
  const onChangeSlippage = useCallback(
    slippage =>
      changedTrade &&
      onChange({
        ...changedTrade,
        slippage,
      }),
    [onChange, changedTrade],
  );

  return (
    <div className="tw-mw-340 tw-mx-auto">
      <h3 className="tw-relative tw-mb-12 tw-text-center tw-text-base tw-font-medium tw-normal-case tw-leading-normal">
        <button
          className="tw-absolute tw-left-0 tw-top-0"
          onClick={onCloseSlippage}
        >
          <img
            className="tw-transform tw-rotate-180"
            src={iconArrowForward}
            alt="Back"
            title="Back"
          />
        </button>
        {t(translations.perpetualPage.tradeForm.titles.slippage)}
      </h3>
      <SlippageForm
        slippage={changedTrade?.slippage || PERPETUAL_SLIPPAGE_DEFAULT}
        onChange={onChangeSlippage}
      />
    </div>
  );
};
