import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useWalletContext } from '@sovryn/react-wallet';
import { DialogTitle, EngageButton, EngageWalletDialogWrapper } from './styled';
import imgLargeNFT from 'assets/images/OriginsLaunchpad/FishSale/large_NFT.svg';
import { Spinner } from '@blueprintjs/core';

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
      <img src={imgLargeNFT} alt="Dialog NFT" />
      <EngageWalletDialogWrapper>
        <div>
          <DialogTitle>
            {t(
              translations.originsLaunchpad.saleDay.engageWalletScreen
                .dialogTitle,
              { token: saleName },
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
      </EngageWalletDialogWrapper>
    </>
  );
};
