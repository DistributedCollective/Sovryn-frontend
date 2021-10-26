import React, { useMemo } from 'react';
import imgLargeNFT from 'assets/images/OriginsLaunchpad/FishSale/large_NFT.svg';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DialogTitle, DialogWrapper } from './styled';
import { ActionButton } from 'app/components/Form/ActionButton';
import { useIsAddressVerified } from 'app/pages/OriginsLaunchpad/hooks/useIsAddressVerified';
import { ISaleInformation } from '../../../../types';

interface IAccessCodeVerificationStepProps {
  tierId: number;
  saleName: string;
  info: ISaleInformation;
  onVerified?: () => void;
}

interface ISaleStatus {
  isClosed: boolean;
  isActive: boolean;
  startAt: string;
}

const timestampToString = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    hour12: false,
    minute: 'numeric',
  });

export const AccessCodeVerificationStep: React.FC<IAccessCodeVerificationStepProps> = ({
  tierId,
  saleName,
  info,
  onVerified,
}) => {
  const { t } = useTranslation();
  const isVerified = useIsAddressVerified(tierId);
  const saleStatus = useMemo<ISaleStatus>(() => {
    const { isClosed, saleStart, period } = info;
    const saleEndTS = Number(saleStart) + Number(period);
    const nowTS = Date.now() / 1e3;
    return {
      isClosed,
      isActive: !isClosed && Number(saleStart) <= nowTS && saleEndTS >= nowTS,
      startAt: timestampToString(Number(saleStart)),
    };
  }, [info]);

  return (
    <>
      <img src={imgLargeNFT} alt="Dialog NFT" />
      <DialogWrapper>
        <div className="tw-max-w-lg">
          <DialogTitle>
            {t(
              translations.originsLaunchpad.saleDay.accessCodeVerificationStep
                .dialogTitle,
              { token: saleName },
            )}
          </DialogTitle>
          <div className="tw-text-xl tw-font-extralight tw-mb-32">
            {saleStatus.isClosed &&
              t(
                translations.originsLaunchpad.saleDay.accessCodeVerificationStep
                  .alert.closed,
                { token: saleName },
              )}
            {!saleStatus.isClosed &&
              saleStatus.isActive &&
              t(
                translations.originsLaunchpad.saleDay.accessCodeVerificationStep
                  .alert.inProgress,
                { token: saleName },
              )}
            {!saleStatus.isClosed &&
              !saleStatus.isActive &&
              t(
                translations.originsLaunchpad.saleDay.accessCodeVerificationStep
                  .alert.notOpenYet,
                { token: saleName, time: saleStatus.startAt },
              )}
          </div>

          {isVerified && (
            <div className="tw-max-w-80 tw-mx-auto">
              <ActionButton
                text={t(
                  translations.originsLaunchpad.saleDay
                    .accessCodeVerificationStep.cta,
                )}
                onClick={onVerified}
                className="tw-block tw-w-full tw-h-10 tw-px-9 tw-mt-8 tw-rounded-xl tw-bg-gray-1 tw-bg-opacity-10"
                textClassName="tw-text-lg tw-tracking-normal tw-leading-snug"
                disabled={!saleStatus.isActive}
              />
            </div>
          )}
        </div>

        {/* {!isVerified && (
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
        )} */}
      </DialogWrapper>
    </>
  );
};
