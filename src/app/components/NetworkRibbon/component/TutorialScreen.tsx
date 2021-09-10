import { Icon } from '@blueprintjs/core';
import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';

import { media } from 'styles/media';
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

interface Props {
  walletType: string;
  onBack: () => void;
}
interface IStep {
  title: string;
  image: any;
  step: string;
}

export function TutorialScreen(props: Props) {
  const [step, setStep] = useState(0);
  const { t } = useTranslation();
  const liqSteps: IStep[] = [
    {
      step: t(translations.wrongNetworkDialog.stepTitle.step1),
      title: t(translations.wrongNetworkDialog.liquality.step1),
      image: liquality01,
    },
    {
      step: t(translations.wrongNetworkDialog.stepTitle.step2),
      title: t(translations.wrongNetworkDialog.liquality.step2),
      image: liquality02,
    },
    {
      step: t(translations.wrongNetworkDialog.stepTitle.step3),
      title: t(translations.wrongNetworkDialog.liquality.step3),
      image: liquality03,
    },
    {
      step: t(translations.wrongNetworkDialog.stepTitle.step4),
      title: t(translations.wrongNetworkDialog.liquality.step4),
      image: liquality04,
    },
    {
      step: t(translations.wrongNetworkDialog.stepTitle.step5),
      title: t(translations.wrongNetworkDialog.liquality.step5),
      image: liquality05,
    },
  ];
  const metaSteps: IStep[] = [
    {
      step: t(translations.wrongNetworkDialog.stepTitle.step1),
      title: t(translations.wrongNetworkDialog.metamask.step1),
      image: metamask01,
    },
    {
      step: t(translations.wrongNetworkDialog.stepTitle.step2),
      title: t(translations.wrongNetworkDialog.metamask.step2),
      image: metamask02,
    },
    {
      step: t(translations.wrongNetworkDialog.stepTitle.step3),
      title: t(translations.wrongNetworkDialog.metamask.step3),
      image: metamask03,
    },
    {
      step: t(translations.wrongNetworkDialog.stepTitle.step4),
      title: t(translations.wrongNetworkDialog.metamask.step4),
      image: metamask04,
    },
    {
      step: t(translations.wrongNetworkDialog.stepTitle.step5),
      title: t(translations.wrongNetworkDialog.metamask.step5),
      image: metamask05,
    },
    {
      step: t(translations.wrongNetworkDialog.stepTitle.step6),
      title: t(translations.wrongNetworkDialog.metamask.step6),
      image: metamask06,
    },
  ];
  const niftySteps: IStep[] = [
    {
      step: t(translations.wrongNetworkDialog.stepTitle.step1),
      title: t(translations.wrongNetworkDialog.nifty.step1),
      image: nifty01,
    },
    {
      step: t(translations.wrongNetworkDialog.stepTitle.step2),
      title: t(translations.wrongNetworkDialog.nifty.step2),
      image: nifty02,
    },
    {
      step: t(translations.wrongNetworkDialog.stepTitle.step3),
      title: t(translations.wrongNetworkDialog.nifty.step3),
      image: nifty03,
    },
  ];
  var steps: IStep[] = [];
  if (props.walletType === 'metamask') {
    steps = metaSteps;
  } else if (props.walletType === 'liquality') {
    steps = liqSteps;
  } else if (props.walletType === 'nifty') {
    steps = niftySteps;
  }
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

  return (
    <>
      <BackButton onClick={props.onBack} />
      <div className="tw-flex tw-flex-row tw-justify-center tw-items-center tw-my-8 tw-py-4">
        <LeftBlock>
          <div className="tw-rounded tw-p-4 tw-text-center">
            <img
              key={step}
              src={steps[step].image}
              alt={steps[step].title}
              className="tw-mx-auto tutorial-image"
            />
          </div>
          <div className="tw-flex tw-flex-row tw-justify-center tw-items-center tw-mt-1">
            <NavBtn onClick={handleBack}>
              <Icon
                icon="caret-left"
                iconSize={24}
                className="tw-text-sov-white"
              />
            </NavBtn>
            {steps.map((_, i) => (
              <NavRound
                onClick={() => setStep(i)}
                active={i === step}
                key={i}
              />
            ))}
            <NavBtn onClick={handleNext}>
              <Icon
                icon="caret-right"
                iconSize={24}
                className="tw-text-sov-white"
              />
            </NavBtn>
          </div>
        </LeftBlock>
        <RightBlock>
          <StepTitle>{steps[step].step}</StepTitle>
          <SettingsTitle className="tw-mt-4">{steps[step].title}</SettingsTitle>
          {step === 3 && props.walletType === 'metamask' && (
            <>
              <SettingsTitle className="tw-mt-12">
                RSK Mainnet Settings
              </SettingsTitle>
              <Details>
                <SubDetails>
                  <DetailTitle className="tw-mt-4">Network Name:</DetailTitle>
                  <DetailTitle className="tw-mt-4">New RPC Url:</DetailTitle>
                  <DetailTitle className="tw-mt-4">Chain Id:</DetailTitle>
                  <DetailTitle className="tw-mt-4">Symbol:</DetailTitle>
                  <DetailTitle className="tw-mt-4">
                    Block Explorer URL:
                  </DetailTitle>
                </SubDetails>
                <SubDetails>
                  <DetailTitle className="tw-mt-4">RSK Mainnet</DetailTitle>
                  <DetailTitle className="tw-mt-4">
                    https://public-node.rsk.co
                  </DetailTitle>
                  <DetailTitle className="tw-mt-4">30</DetailTitle>
                  <DetailTitle className="tw-mt-4">RBTC</DetailTitle>
                  <DetailTitle className="tw-mt-4">
                    https://explorer.rsk.co
                  </DetailTitle>
                </SubDetails>
              </Details>
            </>
          )}
        </RightBlock>
      </div>
    </>
  );
}

const Details = styled.div`
  width: 70%;
  display: flex;
  flex-direction: row;
  /* justify-content: start; */
`;
const SubDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  /* justify-content: start; */
`;
const SettingsTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  color: white;
`;
const StepTitle = styled.div`
  font-size: 1.75rem;
  font-weight: 500;
  text-align: left;
  color: white;
`;
const DetailTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 400;
  text-align: left;
  color: white;
`;
const LeftBlock = styled.div`
  width: 50%;
  /* max-width: 312px; */
  margin-right: 30px;

  .tutorial-image {
    animation: fadeIn 1s ease-in;
    width: 350px;
    height: 350px;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }
`;

const RightBlock = styled.div`
  width: 100%;
  ${media.lg`
    width: 485px;
  `}
`;
const NavRound = styled.button.attrs(_ => ({
  type: 'button',
  className: 'tw-flex-grow-0 tw-flex-shrink-0',
}))`
  border: none;
  margin: 0 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #b1b1b1;
  transition: background-color 0.5s;
  will-change: background-color;
  padding: 0;
  &:hover {
    background-color: #fff;
  }
  ${(props: { active?: boolean }) =>
    props.active &&
    css`
      background-color: #ffff;
    `}
`;

const NavBtn = styled.button.attrs(_ => ({
  type: 'button',
  className: 'tw-flex-grow-0 tw-flex-shrink-0 tw-flex tw-items-center',
}))`
  border: none;
  margin: 0 5px;
  width: 20px;
  height: 20px;
  padding: 0;
  background: none;
`;
