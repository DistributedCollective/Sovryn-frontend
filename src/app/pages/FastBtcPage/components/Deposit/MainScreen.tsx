import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DepositContext } from '../../contexts/deposit-context';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { AppMode, Chain } from '../../../../../types';
import { DepositDetails } from './DepositDetails';
import { DepositInstructions } from './DepositInstructions';
import { FastBtcButton } from '../FastBtcButton';
import { useAccount } from 'app/hooks/useAccount';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { NetworkAwareComponentProps } from '../../types';
import { currentNetwork } from 'utils/classifiers';
import { getBTCAssetForNetwork } from '../../helpers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';

export const MainScreen: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const account = useAccount();
  const {
    ready,
    requestDepositAddress,
    addressLoading,
    addressError,
  } = useContext(DepositContext);
  const { t } = useTranslation();

  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC);

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

  return (
    <>
      <div className="tw-mb-6 tw-text-2xl tw-text-center tw-font-semibold">
        <Trans
          i18nKey={translations.fastBtcPage.deposit.mainScreen.title}
          components={[
            <AssetSymbolRenderer asset={getBTCAssetForNetwork(network)} />,
          ]}
        />
      </div>
      <div className="tw-w-full">
        <div className="tw-py-4 tw-px-8 tw-bg-gray-5 tw-text-white tw-rounded tw-mb-4">
          {t(translations.fastBtcPage.deposit.mainScreen.description)}
        </div>
        <DepositDetails />
        <DepositInstructions />
        {addressError && <ErrorBadge content={addressError} />}
        <div className="tw-px-8">
          <FastBtcButton
            text={t(translations.fastBtcPage.deposit.mainScreen.cta)}
            disabled={!ready || addressLoading || fastBtcLocked}
            loading={addressLoading}
            onClick={onContinueClick}
          />
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
