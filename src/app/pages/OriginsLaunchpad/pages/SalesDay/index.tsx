import React, { useState } from 'react';
import imgTitle from 'assets/images/OriginsLaunchpad/MyntSale/token.svg';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { EngageWalletStep } from './pages/EngageWalletStep/index';
import { AccessCodeVerificationStep } from './pages/AccessCodeVerificationStep/index';
import { useIsConnected } from 'app/hooks/useAccount';
import { ImportantInformationStep } from './pages/ImportantInformationStep';
import { BuyStep } from './pages/BuyStep';
import { useGetSaleInformation } from '../../hooks/useGetSaleInformation';
import styles from './index.module.scss';

interface ISalesDayProps {
  saleName: string;
}

export const SalesDay: React.FC<ISalesDayProps> = ({ saleName }) => {
  const { t } = useTranslation();
  const connected = useIsConnected();
  const info = useGetSaleInformation();

  const [step, setStep] = useState(1);

  const getActiveStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          <AccessCodeVerificationStep
            saleName={saleName}
            onVerified={() => setStep(2)}
            info={info}
          />
        );
      case 2:
        return (
          <ImportantInformationStep
            saleName={saleName}
            onSubmit={() => setStep(3)}
          />
        );
      case 3:
        return <BuyStep saleInformation={info} saleName={saleName} />;
      default:
        return <EngageWalletStep saleName={saleName} />;
    }
  };

  return (
    <div className="tw-mb-52">
      <div className="tw-text-center tw-items-center tw-justify-center tw-flex tw-mb-12">
        <img
          className={styles.titleImage}
          src={imgTitle}
          alt="Origins Sales Day"
        />
        <div className="tw-text-4xl tw-font-semibold tw-leading-none tw-tracking-normal tw-ml-8 tw-uppercase">
          {t(translations.originsLaunchpad.saleDay.title, { token: saleName })}
        </div>
      </div>

      <div className="tw-justify-center tw-flex tw-text-center">
        {!connected ? (
          <EngageWalletStep saleName={saleName} />
        ) : (
          getActiveStep(step)
        )}
      </div>
    </div>
  );
};
