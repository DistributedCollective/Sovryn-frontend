import React from 'react';
import imgLargeNFT from 'assets/images/OriginsLaunchpad/FishSale/large_NFT.svg';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DialogTitle, DialogWrapper } from './styled';
import { ActionButton } from 'app/components/Form/ActionButton';
import { useIsAddressVerified } from 'app/pages/OriginsLaunchpad/hooks/useIsAddressVerified';

interface IAccessCodeVerificationStepProps {
  tierId: number;
  saleName: string;
  onVerified?: () => void;
}

export const AccessCodeVerificationStep: React.FC<IAccessCodeVerificationStepProps> = ({
  tierId,
  saleName,
  onVerified,
}) => {
  const { t } = useTranslation();
  const isVerified = useIsAddressVerified(tierId);

  return (
    <>
      <img src={imgLargeNFT} alt="Dialog NFT" />
      <DialogWrapper>
        <div className="tw-max-w-31.25rem">
          <DialogTitle>
            {t(
              translations.originsLaunchpad.saleDay.accessCodeVerificationStep
                .dialogTitle,
              { token: saleName },
            )}
          </DialogTitle>
          <div className="tw-text-xl tw-font-extralight tw-mb-32">
            {isVerified
              ? t(
                  translations.originsLaunchpad.saleDay
                    .accessCodeVerificationStep.verified,
                )
              : t(
                  translations.originsLaunchpad.saleDay
                    .accessCodeVerificationStep.notVerified,
                )}
          </div>

          {isVerified && (
            <div className="tw-max-w-20rem tw-mx-auto">
              <ActionButton
                text={t(
                  translations.originsLaunchpad.saleDay
                    .accessCodeVerificationStep.cta,
                )}
                onClick={onVerified}
                className="tw-block tw-w-full tw-h-10 tw-px-9 tw-mt-8 tw-rounded-10px tw-bg-primary tw-bg-opacity-5"
                textClassName="tw-text-lg tw-tracking-normal tw-leading-5.5"
              />
            </div>
          )}
        </div>

        {!isVerified && (
          <div>
            <Trans
              i18nKey={
                translations.originsLaunchpad.saleDay.accessCodeVerificationStep
                  .notVerifiedFooter
              }
              components={[
                <a
                  href="#!"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="tw-text-secondary tw-text-underline"
                >
                  Don't have a code?
                </a>,
              ]}
            />
          </div>
        )}
      </DialogWrapper>
    </>
  );
};
