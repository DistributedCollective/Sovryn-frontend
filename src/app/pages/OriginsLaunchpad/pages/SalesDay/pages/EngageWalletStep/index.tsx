import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useWalletContext } from '@sovryn/react-wallet';
import { DialogTitle, EngageButton, EngageWalletDialogWrapper } from './styled';
import imgLargeNFT from 'assets/images/OriginsLaunchpad/FishSale/large_NFT.svg';
import { Spinner } from '@blueprintjs/core';

export const EngageWalletStep: React.FC = () => {
  const { t } = useTranslation();
  const { loading: connecting, connect } = useWalletContext();

  const onEngageClick = useCallback(() => connect(), [connect]);

  return (
    <>
      <img src={imgLargeNFT} alt="Dialog NFT" />
      <EngageWalletDialogWrapper>
        <DialogTitle>
          {t(
            translations.originsLaunchpad.saleDay.engageWalletScreen
              .dialogTitle,
            { token: 'FISH' },
          )}
        </DialogTitle>

        <EngageButton
          onClick={onEngageClick}
          className="tw-flex tw-justify-center tw-items-center"
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
        </EngageButton>

        <div className="tw-mt-32 tw-max-w-28.75rem">
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
      </EngageWalletDialogWrapper>
    </>
  );
};
