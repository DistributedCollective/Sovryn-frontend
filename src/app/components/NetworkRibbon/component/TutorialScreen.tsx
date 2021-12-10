import { Icon } from '@blueprintjs/core';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';
import liquality01 from '../../../../assets/wallet_tutorials/liquality/liquality_01.svg';
import liquality02 from '../../../../assets/wallet_tutorials/liquality/liquality_02.svg';
import liquality03 from '../../../../assets/wallet_tutorials/liquality/liquality_03.svg';
import liquality04 from '../../../../assets/wallet_tutorials/liquality/liquality_04.svg';
import liquality05 from '../../../../assets/wallet_tutorials/liquality/liquality_05.svg';
import metamask01 from '../../../../assets/wallet_tutorials/metamask/metamask_01.svg';
import metamask02 from '../../../../assets/wallet_tutorials/metamask/metamask_02.svg';
import metamask03 from '../../../../assets/wallet_tutorials/metamask/metamask_03.svg';
import metamask04 from '../../../../assets/wallet_tutorials/metamask/metamask_04.svg';
import metamask05 from '../../../../assets/wallet_tutorials/metamask/metamask_05.svg';
import metamask06 from '../../../../assets/wallet_tutorials/metamask/metamask_06.svg';
import nifty01 from '../../../../assets/wallet_tutorials/nifty/nifty_01.svg';
import nifty02 from '../../../../assets/wallet_tutorials/nifty/nifty_02.svg';
import nifty03 from '../../../../assets/wallet_tutorials/nifty/nifty_03.svg';
import { BackButton } from '../../../components/BackButton';
import { Network } from '../types';
import { capitalize } from '../../../../utils/helpers';
import styles from '../NetworkRibbon.module.scss';
import classNames from 'classnames';

type Step = {
  title: string;
  image: any;
  step: string;
};

const liqualitySteps: Step[] = [
  {
    step: translations.wrongNetworkDialog.stepTitle.step1,
    title: translations.wrongNetworkDialog.liquality.step1,
    image: liquality01,
  },
  {
    step: translations.wrongNetworkDialog.stepTitle.step2,
    title: translations.wrongNetworkDialog.liquality.step2,
    image: liquality02,
  },
  {
    step: translations.wrongNetworkDialog.stepTitle.step3,
    title: translations.wrongNetworkDialog.liquality.step3,
    image: liquality03,
  },
  {
    step: translations.wrongNetworkDialog.stepTitle.step4,
    title: translations.wrongNetworkDialog.liquality.step4,
    image: liquality04,
  },
  {
    step: translations.wrongNetworkDialog.stepTitle.step5,
    title: translations.wrongNetworkDialog.liquality.step5,
    image: liquality05,
  },
];
const metamaskSteps: Step[] = [
  {
    step: translations.wrongNetworkDialog.stepTitle.step1,
    title: translations.wrongNetworkDialog.metamask.step1,
    image: metamask01,
  },
  {
    step: translations.wrongNetworkDialog.stepTitle.step2,
    title: translations.wrongNetworkDialog.metamask.step2,
    image: metamask02,
  },
  {
    step: translations.wrongNetworkDialog.stepTitle.step3,
    title: translations.wrongNetworkDialog.metamask.step3,
    image: metamask03,
  },
  {
    step: translations.wrongNetworkDialog.stepTitle.step4,
    title: translations.wrongNetworkDialog.metamask.step4,
    image: metamask04,
  },
  {
    step: translations.wrongNetworkDialog.stepTitle.step5,
    title: translations.wrongNetworkDialog.metamask.step5,
    image: metamask05,
  },
  {
    step: translations.wrongNetworkDialog.stepTitle.step6,
    title: translations.wrongNetworkDialog.metamask.step6,
    image: metamask06,
  },
];
const niftySteps: Step[] = [
  {
    step: translations.wrongNetworkDialog.stepTitle.step1,
    title: translations.wrongNetworkDialog.nifty.step1,
    image: nifty01,
  },
  {
    step: translations.wrongNetworkDialog.stepTitle.step2,
    title: translations.wrongNetworkDialog.nifty.step2,
    image: nifty02,
  },
  {
    step: translations.wrongNetworkDialog.stepTitle.step3,
    title: translations.wrongNetworkDialog.nifty.step3,
    image: nifty03,
  },
];

const stepsMap = {
  metamask: metamaskSteps,
  liquality: liqualitySteps,
  nifty: niftySteps,
};

type TutorialScreenProps = {
  walletType: string;
  network?: Network;
  onBack: () => void;
};

export const TutorialScreen: React.FC<TutorialScreenProps> = ({
  walletType,
  network,
  onBack,
}) => {
  const [step, setStep] = useState(0);
  const { t } = useTranslation();

  var steps = stepsMap[walletType];

  const handleBack = () => {
    let next = step - 1;
    if (next < 0) {
      next = steps.length - 1;
    }
    setStep(next);
  };
  const handleNext = () => {
    let next = step + 1;
    if (next > steps.length - 1) {
      next = 0;
    }
    setStep(next);
  };

  const tOptions = useMemo(
    () =>
      network && {
        name: network.name,
        chain: network.chain,
        network: `${network.chain} ${capitalize(network.network)}`,
      },
    [network],
  );

  if (!network && !steps?.[step]) {
    return null;
  }

  return (
    <>
      <BackButton onClick={onBack} />
      <div className="tw-flex tw-flex-row tw-justify-center tw-items-center tw-my-8 tw-py-4">
        <div className="tw-w-1/4 lg:tw-w-2/5 tw-mr-8">
          <div className="tw-rounded tw-p-4 tw-text-center">
            <img
              key={step}
              src={steps[step].image}
              alt={t(steps[step].title, tOptions)}
              className={styles.tutorialImage}
            />
          </div>
          <div className="tw-flex tw-flex-row tw-justify-center tw-items-center tw-mt-1">
            <button
              className={styles.navArrow}
              type="button"
              onClick={handleBack}
            >
              <Icon icon="caret-left" iconSize={24} />
            </button>
            {steps.map((_, i) => (
              <button
                key={i}
                className={classNames(
                  styles.navRound,
                  i === step && 'tw-bg-white',
                )}
                type="button"
                onClick={() => setStep(i)}
              />
            ))}
            <button
              className={styles.navArrow}
              type="button"
              onClick={handleNext}
            >
              <Icon icon="caret-right" iconSize={24} />
            </button>
          </div>
        </div>
        <div className="tw-w-3/4 lg:tw-w-3/5">
          <div className="tw-text-left tw-text-3xl tw-font-medium tw-text-white">
            {t(steps[step].step, tOptions)}
          </div>
          <div className="tw-text-left tw-text-base tw-font-medium tw-text-white tw-mt-4">
            {t(steps[step].title, tOptions)}
          </div>
          {step === 3 && walletType === 'metamask' && (
            <>
              <div className="tw-text-left tw-text-base tw-font-medium tw-text-white tw-mt-12">
                {t(translations.wrongNetworkDialog.settings.title, tOptions)}
              </div>
              <div className={styles.subDetails}>
                <div>
                  {t(translations.wrongNetworkDialog.settings.name, tOptions)}
                </div>
                <div>{tOptions?.network || ''}</div>
              </div>
              <div className={styles.subDetails}>
                <div>
                  {t(translations.wrongNetworkDialog.settings.rpc, tOptions)}
                </div>
                <div>{network?.rpc[0] || ''}</div>
              </div>
              <div className={styles.subDetails}>
                <div>
                  {t(
                    translations.wrongNetworkDialog.settings.chainId,
                    tOptions,
                  )}
                </div>
                <div>{network?.chainId || ''}</div>
              </div>
              <div className={styles.subDetails}>
                <div>
                  {t(translations.wrongNetworkDialog.settings.symbol, tOptions)}
                </div>
                <div>{network?.nativeCurrency.symbol || ''}</div>
              </div>
              <div className={styles.subDetails}>
                <div>
                  {t(
                    translations.wrongNetworkDialog.settings.explorer,
                    tOptions,
                  )}
                </div>
                <div>{network?.explorers[0]?.url || ''}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
