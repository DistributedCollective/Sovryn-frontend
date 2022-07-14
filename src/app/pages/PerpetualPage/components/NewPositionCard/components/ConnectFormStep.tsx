import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useWalletContext } from '@sovryn/react-wallet';
import { translations } from '../../../../../../locales/i18n';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { NewPositionCardStep } from '../types';
import { PerpetualPageModals } from 'app/pages/PerpetualPage/types';
import { actions } from '../../../slice';
import { useDispatch } from 'react-redux';

export const ConnectFormStep: TransitionStep<NewPositionCardStep> = ({
  changeTo,
}) => {
  const { t } = useTranslation();
  const { connect } = useWalletContext();

  const dispatch = useDispatch();

  const onViewAccount = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.ACCOUNT_BALANCE)),
    [dispatch],
  );

  return (
    <div className="tw-flex-grow tw-p-4 tw-text-xs">
      <p className="tw-mt-4">
        {t(translations.perpetualPage.tradeForm.text.welcome1)}
      </p>
      <ul className="tw-ml-4 tw-mb-8 tw-list-disc">
        <li className="tw-mb-1">
          <Trans
            i18nKey={translations.perpetualPage.tradeForm.text.welcome2}
            components={[
              <button
                className="tw-text-secondary tw-underline"
                onClick={onViewAccount}
              >
                Fund your wallet
              </button>,
            ]}
          />
        </li>
        <li className="tw-mb-1">
          {t(translations.perpetualPage.tradeForm.text.welcome3)}
        </li>
      </ul>
      <p className="tw-mb-11">
        <Trans
          i18nKey={translations.perpetualPage.tradeForm.text.welcome4}
          components={[
            <a
              className="tw-text-secondary tw-underline"
              href="https://wiki.sovryn.app/en/sovryn-dapp/perpetual-futures#how-to-trade-perpetual-futures"
              target="_blank"
              rel="noreferrer"
            >
              Quickstart Guide
            </a>,
          ]}
        />
      </p>
      <button
        className="tw-w-full tw-min-h-10 tw-p-2 tw-text-base tw-text-primary tw-border tw-border-primary tw-bg-transparent tw-rounded-lg tw-transition-colors tw-duration-300 hover:tw-bg-primary-10"
        onClick={connect}
      >
        {t(translations.perpetualPage.tradeForm.buttons.connect)}
      </button>
    </div>
  );
};
