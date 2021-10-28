import React, { useMemo } from 'react';
import camelCase from 'camelcase';
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

enum SaleStatus {
  Closed = 'Closed',
  Active = 'Active',
  NotYetOpen = 'NotYetOpen',
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
  const saleStatus = useMemo<SaleStatus>(() => {
    const { isClosed, saleStart, period } = info;
    if (isClosed) return SaleStatus.Closed;
    const saleEndTS = Number(saleStart) + Number(period);
    const nowTS = Date.now() / 1e3;
    if (!isClosed && Number(saleStart) <= nowTS && saleEndTS >= nowTS)
      return SaleStatus.Active;
    return SaleStatus.NotYetOpen;
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
            {t(
              translations.originsLaunchpad.saleDay.accessCodeVerificationStep
                .alert[camelCase(saleStatus)],
              {
                token: saleName,
                time: timestampToString(Number(info.saleStart)),
              },
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
                disabled={saleStatus !== SaleStatus.Active}
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
