import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
    <div className="tw-flex-grow tw-p-4 tw-text-xs">
      <p className="tw-mt-4">
        {t(translations.perpetualPage.tradeForm.text.welcome1)}
      </p>
      <p className="tw-mb-2">
        {t(translations.perpetualPage.tradeForm.text.welcome2)}
      </p>
      <ul className="tw-ml-4 tw-mb-8 tw-list-disc">
        <Trans
          i18nKey={translations.perpetualPage.tradeForm.text.welcome3}
          components={[<li className="tw-mb-1" />]}
        />
      </ul>
      <p className="tw-mb-11">
        {/* TODO: add href to quickstart guide */}
        <Trans
          i18nKey={translations.perpetualPage.tradeForm.text.welcome4}
          components={[
            <a
              className="tw-text-secondary tw-underline"
              href="https://wiki.sovryn.app/"
            >
              Quickstart Guide
            </a>,
          ]}
        />
      </p>
      <button
        className="tw-w-full tw-min-h-10 tw-p-2 tw-text-base tw-text-primary tw-border tw-border-primary tw-bg-primary-05 tw-rounded-lg tw-transition-colors tw-duration-300 hover:tw-bg-primary-25"
        onClick={connect}
      >
        {t(translations.perpetualPage.tradeForm.buttons.connect)}
      </button>
    </div>
  );
};
