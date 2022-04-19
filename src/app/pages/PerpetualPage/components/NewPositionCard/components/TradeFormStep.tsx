import React, { useCallback, useContext } from 'react';
import { NewPositionCardContext } from '..';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { TradeForm } from '../../TradeForm';
import { NewPositionCardStep } from '../types';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../../locales/i18n';

export const TradeFormStep: TransitionStep<NewPositionCardStep> = ({
  changeTo,
}) => {
  const { t } = useTranslation();

  const { hasEmptyBalance, trade, onSubmit, onChangeTrade } = useContext(
    NewPositionCardContext,
  );

  const onOpenSlippage = useCallback(
    () => changeTo(NewPositionCardStep.slippage),
    [changeTo],
  );

  return (
    <div className="tw-relative tw-p-4">
      {hasEmptyBalance && (
        <div className="tw-absolute tw-left-0 tw-top-0 tw-bg-black tw-h-full tw-w-full tw-px-10 tw-z-10 tw-bg-opacity-90 tw-flex tw-items-center tw-justify-center tw-flex-col tw-text-center tw-text-sm tw-font-semibold">
          <div>
            {t(
              translations.perpetualPage.tradeForm.disabledState
                .emptyBalanceExplanation,
            )}
          </div>
        </div>
      )}
      <TradeForm
        trade={trade}
        disabled={hasEmptyBalance}
        onOpenSlippage={onOpenSlippage}
        onSubmit={onSubmit}
        onChange={onChangeTrade}
      />
    </div>
  );
};
