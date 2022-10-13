import React, { useCallback, useContext } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { WithdrawDetails } from './WithdrawDetails';
import { WithdrawInstructions } from './WithdrawInstructions';
import { FastBtcButton } from '../FastBtcButton';
import { NetworkAwareComponentProps } from '../../types';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { WalletContext } from '@sovryn/react-wallet';

export const MainScreen: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const { set } = useContext(WithdrawContext);
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC);

  const { connect, connected, connecting } = useContext(WalletContext);

  const onContinueClick = useCallback(
    () => set(prevState => ({ ...prevState, step: WithdrawStep.AMOUNT })),
    [set],
  );

  return (
    <>
      <div className="tw-w-full tw-mt-2.5 tw-px-2.5 tw-pb-8">
        <div className="tw-py-4 tw-px-6 tw-bg-gray-5 tw-font-semibold tw-text-white tw-rounded tw-mb-4 tw-text-center">
          {t(translations.fastBtcPage.withdraw.mainScreen.description)}
        </div>
        <WithdrawDetails network={network} />
        <WithdrawInstructions />
        <div className="tw-px-8 tw-text-center">
          {connected ? (
            <FastBtcButton
              text={t(translations.common.continue)}
              onClick={onContinueClick}
              disabled={fastBtcLocked}
            />
          ) : (
            <FastBtcButton
              text={t(translations.wallet.btn)}
              onClick={connect}
              disabled={connecting}
              loading={connecting}
            />
          )}
          {fastBtcLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.fastBTC}
                  components={[
                    <a
                      href={discordInvite}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                    >
                      x
                    </a>,
                  ]}
                />
              }
            />
          )}
        </div>
      </div>
    </>
  );
};
