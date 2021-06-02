import React from 'react';
import imgTitle from 'assets/images/OriginsLaunchpad/FishSale/title_image.png';
import { TitleContent, TitleImage } from './styled';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { EngageWalletStep } from './pages/EngageWalletStep/index';
import { AccessCodeVerificationStep } from './pages/AccessCodeVerificationStep/index';

export const SalesDay: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="tw-mb-52">
      <div className="tw-text-center tw-items-center tw-justify-center tw-flex tw-mb-28">
        <TitleImage src={imgTitle} />
        <TitleContent>
          {t(translations.originsLaunchpad.saleDay.title, { token: 'Fish' })}
        </TitleContent>
      </div>

      <div className="tw-justify-center tw-flex tw-text-center">
        {/* <EngageWalletStep /> */}
        <AccessCodeVerificationStep />
      </div>
    </div>
  );
};
