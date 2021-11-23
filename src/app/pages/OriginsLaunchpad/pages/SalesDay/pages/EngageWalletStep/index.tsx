import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { translations } from 'locales/i18n';
import { useWalletContext } from '@sovryn/react-wallet';
import imgLargeNFT from 'assets/origins_launchpad/MYNT_NFT_Large.png';
import { Spinner } from '@blueprintjs/core';
import styles from './index.module.scss';

interface IEngageWalletStepProps {
  saleName: string;
}

export const EngageWalletStep: React.FC<IEngageWalletStepProps> = ({
  saleName,
}) => {
  const { t } = useTranslation();
  const { connecting, connect } = useWalletContext();

  const onEngageClick = useCallback(() => connect(), [connect]);

  return (
    <>
      <img
        src={imgLargeNFT}
        alt="Dialog NFT"
        className="tw-my-auto tw-border-solid tw-border-8 tw-border-gray-9 tw-rounded-3xl"
      />
      <div className={styles.engageWalletDialogWrapper}>
        <div>
          <div className={styles.dialogTitle}>
            {t(
              translations.originsLaunchpad.saleDay.engageWalletScreen
                .dialogTitle,
              { token: saleName },
            )}
          </div>

          <button
            onClick={onEngageClick}
            className={classNames(
              'tw-flex tw-justify-center tw-items-center',
              styles.engageButton,
            )}
          >
            {connecting && <Spinner size={22} />}
            {!connecting && (
              <span className="xl:tw-inline tw-truncate">
                {t(
                  translations.originsLaunchpad.saleDay.engageWalletScreen
                    .buttonText,
                )}
              </span>
            )}
          </button>
        </div>

        <div className="tw-max-w-md tw-mx-auto">
          <div>
            <Trans
              i18nKey={
                translations.originsLaunchpad.saleDay.engageWalletScreen
                  .dialogFooter1
              }
              components={[
                <a
                  href="https://rsk.co"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="tw-text-secondary tw-text-underline"
                >
                  RSK Mainnet
                </a>,
              ]}
            />
          </div>

          <div className="tw-mt-6">
            <Trans
              i18nKey={
                translations.originsLaunchpad.saleDay.engageWalletScreen
                  .dialogFooter2
              }
              components={[
                <a
                  href="https://liquality.io/atomic-swap-wallet.html"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="tw-text-secondary tw-text-underline"
                >
                  Liquality wallet
                </a>,
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};
