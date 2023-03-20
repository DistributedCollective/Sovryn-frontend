import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DepositContext } from '../../contexts/deposit-context';
import { AppMode, Chain } from '../../../../../types';
import { DepositDetails } from './DepositDetails';
import { DepositInstructions } from './DepositInstructions';
import { FastBtcButton } from '../FastBtcButton';
import { useAccount } from 'app/hooks/useAccount';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { FastBtcDirectionType, NetworkAwareComponentProps } from '../../types';
import { currentNetwork } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';
import { WalletContext } from '@sovryn/react-wallet';

type MainScreenProps = NetworkAwareComponentProps & {
  type: FastBtcDirectionType;
};

export const MainScreen: React.FC<MainScreenProps> = ({ network, type }) => {
  const account = useAccount();
  const {
    ready,
    requestDepositAddress,
    addressLoading,
    addressError,
  } = useContext(DepositContext);
  const { t } = useTranslation();

  const { checkMaintenance, States } = useMaintenance();

  const fastBtcReceiveLocked = checkMaintenance(States.FASTBTC_RECEIVE);
  const transakLocked = checkMaintenance(States.TRANSAK);

  const { connect, connected, connecting } = useContext(WalletContext);

  const prefix = useMemo(() => {
    if (network === Chain.BSC) {
      return currentNetwork === AppMode.MAINNET ? 'bsc:' : 'bsctest:';
    }
    return '';
  }, [network]);

  const onContinueClick = useCallback(
    () => requestDepositAddress(`${prefix}${account}`),
    [requestDepositAddress, account, prefix],
  );

  const isDisabled = useMemo(() => {
    if (fastBtcReceiveLocked || !ready || addressLoading) {
      return true;
    }
    return transakLocked && type === FastBtcDirectionType.TRANSAK;
  }, [addressLoading, fastBtcReceiveLocked, ready, transakLocked, type]);

  return (
    <>
      <div className="tw-w-full tw-mt-2.5 tw-px-2.5 tw-pb-8">
        <div className="tw-py-4 tw-px-6 tw-bg-gray-5 tw-font-semibold tw-text-white tw-rounded tw-mb-4 tw-text-center">
          {t(translations.fastBtcPage.deposit.mainScreen.description)}
        </div>
        <DepositDetails />
        <DepositInstructions />
        {addressError && <ErrorBadge content={addressError} />}
        <div className="tw-px-8 tw-text-center">
          {connected ? (
            <FastBtcButton
              text={t(translations.fastBtcPage.deposit.mainScreen.cta)}
              disabled={isDisabled}
              loading={addressLoading}
              onClick={onContinueClick}
            />
          ) : (
            <FastBtcButton
              text={t(translations.wallet.btn)}
              disabled={connecting}
              loading={connecting}
              onClick={connect}
            />
          )}

          {(fastBtcReceiveLocked ||
            (type === FastBtcDirectionType.TRANSAK && transakLocked)) && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={
                    fastBtcReceiveLocked
                      ? translations.maintenance.fastBTC
                      : translations.maintenance.transack
                  }
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
