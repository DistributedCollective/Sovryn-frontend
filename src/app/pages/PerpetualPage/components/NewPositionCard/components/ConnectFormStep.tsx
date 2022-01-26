import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWalletContext } from '@sovryn/react-wallet';
import { translations } from '../../../../../../locales/i18n';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { NewPositionCardStep } from '../types';

export const ConnectFormStep: TransitionStep<NewPositionCardStep> = ({
  changeTo,
}) => {
  const { t } = useTranslation();
  const { connect } = useWalletContext();

  return (
    <div className="tw-absolute tw-w-full tw-top-1/2 tw-h-auto tw-p-4">
      <button
        className="tw-w-full tw-min-h-10 tw-p-2 tw-text-base tw-text-primary tw-border tw-border-primary tw-bg-primary-05 tw-rounded-lg tw-transition-colors tw-duration-300 hover:tw-bg-primary-25"
        onClick={connect}
      >
        {t(translations.perpetualPage.tradeForm.buttons.connect)}
      </button>
    </div>
  );
};
