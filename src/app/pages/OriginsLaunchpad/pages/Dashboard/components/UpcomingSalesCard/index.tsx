import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { CardImage, CardWrapper } from './styled';

interface IUpcomingSalesCardProps {
  saleToken: string;
  project: string;
  startDate: string;
  startPrice: string;
  backgroundImage: string;
}

export const UpcomingSalesCard: React.FC<IUpcomingSalesCardProps> = ({
  saleToken,
  project,
  startDate,
  startPrice,
  backgroundImage,
}) => {
  const { t } = useTranslation();
  return (
    <CardWrapper>
      <CardImage style={{ backgroundImage: `url(${backgroundImage})` }} />
      <div className="tw-relative">
        <div className="tw-mb-4 tw-tracking-normal">
          <div className="tw-text-sm tw-font-extralight tw-leading-5">
            {t(
              translations.originsLaunchpad.upcomingSales.projectCard.saleToken,
            )}
            :
          </div>
          <div className="tw-font-orbitron tw-font-medium tw-text-xl tw-leading-6">
            {saleToken}
          </div>
        </div>

        <div className="tw-mb-12 tw-tracking-normal">
          <div className="tw-text-sm tw-font-extralight tw-leading-5">
            {t(translations.originsLaunchpad.upcomingSales.projectCard.project)}
            :
          </div>
          <div className="tw-font-orbitron tw-font-medium tw-text-xl tw-leading-6">
            {project}
          </div>
        </div>

        <div className="tw-mb-4 tw-tracking-normal">
          <div className="tw-text-sm tw-font-extralight tw-leading-5">
            {t(
              translations.originsLaunchpad.upcomingSales.projectCard.startDate,
            )}
            :
          </div>
          <div className="tw-text-lg tw-leading-6">{startDate}</div>
        </div>

        <div className="tw-tracking-normal">
          <div className="tw-text-sm tw-font-extralight tw-leading-5">
            {t(
              translations.originsLaunchpad.upcomingSales.projectCard
                .startPrice,
            )}
            :
          </div>
          <div className="tw-text-lg tw-leading-6">{startPrice}</div>
        </div>
      </div>

      <a
        href="https://wiki.sovryn.app/en/technical-documents/sip-repository"
        target="_blank"
        className="tw-absolute tw-top-0 tw-left-0 tw-block tw-w-full tw-h-full tw-opacity-0 tw-select-none"
        rel="noopener noreferrer"
      >
        Sovryn Improvement Proposals
      </a>
    </CardWrapper>
  );
};
