import React, { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TransitionStep } from '../../../../containers/TransitionSteps';
import iconArrowForward from 'assets/images/arrow_forward.svg';
import { SlippageForm } from '../SlippageForm';
import { NewPositionCardContext } from '.';
import { NewPositionCardStep } from './types';
import { TransitionAnimation } from '../../../../containers/TransitionContainer';
import { translations } from '../../../../../locales/i18n';

export const SlippageFormStep: TransitionStep<NewPositionCardStep> = ({
  changeTo,
}) => {
  const { t } = useTranslation();

  const { trade, onChangeTrade } = useContext(NewPositionCardContext);

  const onCloseSlippage = useCallback(
    () => changeTo(NewPositionCardStep.trade, TransitionAnimation.slideRight),
    [changeTo],
  );
  const onChangeSlippage = useCallback(
    slippage => onChangeTrade({ ...trade, slippage }),
    [trade, onChangeTrade],
  );

  return (
    <div>
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
      <SlippageForm slippage={trade.slippage} onChange={onChangeSlippage} />
    </div>
  );
};
