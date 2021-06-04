import React, { useState } from 'react';
import imgTitle from 'assets/images/OriginsLaunchpad/FishSale/title_image.png';
import { TitleContent, TitleImage } from './styled';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { EngageWalletStep } from './pages/EngageWalletStep/index';
import { AccessCodeVerificationStep } from './pages/AccessCodeVerificationStep/index';
import { useIsConnected } from 'app/hooks/useAccount';
import { ImportantInformationStep } from './pages/ImportantInformationStep';
import { BuyStep } from './pages/BuyStep';

export const SalesDay: React.FC = () => {
  const { t } = useTranslation();
  const connected = useIsConnected();

  // This is just a temporary solution for a prototype purposes
  const [step, setStep] = useState(1);

  const getActiveStep = (step: number) => {
    switch (step) {
      case 1:
        return <AccessCodeVerificationStep onVerified={() => setStep(2)} />;
      case 2:
        return <ImportantInformationStep onSubmit={() => setStep(3)} />;
      case 3:
        return <BuyStep />;
      default:
        return <EngageWalletStep />;
    }
  };

  return (
    <div className="tw-mb-52">
      <div className="tw-text-center tw-items-center tw-justify-center tw-flex tw-mb-28">
        <TitleImage src={imgTitle} />
        <TitleContent>
          {t(translations.originsLaunchpad.saleDay.title, { token: 'Fish' })}
        </TitleContent>
      </div>

      <div className="tw-justify-center tw-flex tw-text-center">
        {!connected ? <EngageWalletStep /> : getActiveStep(step)}
      </div>
    </div>
  );
};
