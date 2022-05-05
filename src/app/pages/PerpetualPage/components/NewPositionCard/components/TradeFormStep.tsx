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

  const {
    hasEmptyBalance,
    hasOpenPosition,
    trade,
    onSubmit,
    onChangeTrade,
  } = useContext(NewPositionCardContext);

  const onOpenSlippage = useCallback(
    () => changeTo(NewPositionCardStep.slippage),
    [changeTo],
  );

  return (
    <div className="tw-relative tw-p-4">
      {(hasOpenPosition || hasEmptyBalance) && (
        <div className="tw-absolute tw-left-0 tw-top-0 tw-bg-black tw-h-full tw-w-full tw-px-10 tw-z-10 tw-bg-opacity-90 tw-flex tw-items-center tw-justify-center tw-flex-col tw-text-center tw-text-sm tw-font-semibold">
          {hasOpenPosition ? (
            <>
              <div>
                {t(
                  translations.perpetualPage.tradeForm.disabledState
                    .explanation1,
                )}
              </div>
              <div className="tw-mt-4">
                {t(
                  translations.perpetualPage.tradeForm.disabledState
                    .explanation2,
                )}
              </div>
            </>
          ) : (
            <div>
              {t(
                translations.perpetualPage.tradeForm.disabledState
                  .emptyBalanceExplanation,
              )}
            </div>
          )}
        </div>
      )}
      <TradeForm
        trade={trade}
        isNewTrade
        disabled={hasEmptyBalance || hasOpenPosition}
        onOpenSlippage={onOpenSlippage}
        onSubmit={onSubmit}
        onChange={onChangeTrade}
      />
    </div>
  );
};
