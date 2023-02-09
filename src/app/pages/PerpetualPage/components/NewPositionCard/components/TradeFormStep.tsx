import React, { useCallback, useContext, useMemo } from 'react';
import { NewPositionCardContext } from '..';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { TradeForm } from '../../TradeForm';
import { NewPositionCardStep } from '../types';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from '../../../../../../locales/i18n';
import { selectPerpetualPage } from 'app/pages/PerpetualPage/selectors';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

export const TradeFormStep: TransitionStep<NewPositionCardStep> = ({
  changeTo,
}) => {
  const { t } = useTranslation();

  const { isAddressWhitelisted } = useSelector(selectPerpetualPage);

  const { hasEmptyBalance, trade, onSubmit, setTrade } = useContext(
    NewPositionCardContext,
  );

  const onOpenSlippage = useCallback(
    () => changeTo(NewPositionCardStep.slippage),
    [changeTo],
  );

  const isDisabled = useMemo(() => !isAddressWhitelisted || hasEmptyBalance, [
    hasEmptyBalance,
    isAddressWhitelisted,
  ]);

  return (
    <div
      className={classNames('tw-relative', {
        'tw-p-4': isDisabled,
      })}
    >
      {isDisabled && (
        <div className="tw-absolute tw-left-0 tw-top-0 tw-bg-black tw-h-full tw-w-full tw-px-10 tw-z-10 tw-bg-opacity-90 tw-flex tw-items-center tw-justify-center tw-flex-col tw-text-center tw-text-sm tw-font-semibold">
          <div>
            {!isAddressWhitelisted ? (
              <Trans
                i18nKey={
                  translations.perpetualPage.tradeForm.disabledState
                    .whitelistExplanation
                }
                components={[
                  <a
                    className="tw-underline"
                    href="https://alpha.sovryn.app/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    sovryn.app
                  </a>,
                  <a
                    className="tw-underline"
                    href="https://twitter.com/SovrynBTC"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Twitter
                  </a>,
                ]}
              />
            ) : (
              t(
                translations.perpetualPage.tradeForm.disabledState
                  .emptyBalanceExplanation,
              )
            )}
          </div>
        </div>
      )}
      <TradeForm
        trade={trade}
        disabled={isDisabled}
        onOpenSlippage={onOpenSlippage}
        onSubmit={onSubmit}
        setTrade={setTrade}
      />
    </div>
  );
};
