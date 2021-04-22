import { Icon } from '@blueprintjs/core';
import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';

import { media } from 'styles/media';

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

const liqSteps: IStep[] = [
  {
    step: 'Step 01:',
    title: 'Open up Liquality in your browser',
    image: liquality01,
  },
  { step: 'Step 02:', title: 'Go to dropdown', image: liquality02 },
  { step: 'Step 03:', title: 'Select Settings', image: liquality03 },
  { step: 'Step 04:', title: 'Go to network dropdown', image: liquality04 },
  { step: 'Step 05:', title: 'Select RSK', image: liquality05 },
];
const metaSteps: IStep[] = [
  {
    step: 'Step 01:',
    title: 'Open up Metamask in your browser',
    image: metamask01,
  },
  { step: 'Step 02:', title: 'Go to network dropdown', image: metamask02 },
  { step: 'Step 03:', title: 'Select Custom RPC', image: metamask03 },
  { step: 'Step 04:', title: 'Input RSK Mainnet settings', image: metamask04 },
  { step: 'Step 05:', title: 'Click Save', image: metamask05 },
  { step: 'Step 06:', title: 'Click Add Network', image: metamask06 },
];
const niftySteps: IStep[] = [
  {
    step: 'Step 01:',
    title: 'Open up Liquality in your browser',
    image: nifty01,
  },
  { step: 'Step 02:', title: 'Go to dropdown', image: nifty02 },
  { step: 'Step 03:', title: 'Select Settings', image: nifty03 },
];
export function TutorialScreen(props: Props) {
  const [step, setStep] = useState(0);
  var steps: IStep[] = [];
  if (props.walletType === 'Metamask') {
    steps = metaSteps;
  } else if (props.walletType === 'Liquality') {
    steps = liqSteps;
  } else if (props.walletType === 'Nifty') {
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
      <div className="d-flex flex-row justify-content-center align-items-center my-4">
        <LeftBlock>
          <div className="rounded p-2 text-center">
            <img
              key={step}
              src={steps[step].image}
              alt={steps[step].title}
              className="mx-auto tutorial-image"
            />
          </div>
          <div className="d-flex flex-row justify-content-center align-items-center mt-1">
            <NavBtn onClick={handleBack}>
              <Icon icon="caret-left" iconSize={24} className="text-white" />
            </NavBtn>
            {steps.map((_, i) => (
              <NavRound
                onClick={() => setStep(i)}
                active={i === step}
                key={i}
              />
            ))}
            <NavBtn onClick={handleNext}>
              <Icon icon="caret-right" iconSize={24} className="text-white" />
            </NavBtn>
          </div>
        </LeftBlock>
        <RightBlock>
          <StepTitle>{steps[step].step}</StepTitle>
          <SettingsTitle className="mt-3">{steps[step].title}</SettingsTitle>
          {step === 3 && props.walletType === 'Metamask' && (
            <>
              <SettingsTitle className="mt-5">
                RSK Mainnet Settings
              </SettingsTitle>
              <Details>
                <SubDetails>
                  <DetailTitle className="mt-3">Network Name:</DetailTitle>
                  <DetailTitle className="mt-3">New RPC Url:</DetailTitle>
                  <DetailTitle className="mt-3">Chaind Id:</DetailTitle>
                  <DetailTitle className="mt-3">Symbol:</DetailTitle>
                  <DetailTitle className="mt-3">
                    Block Explorer URL:
                  </DetailTitle>
                </SubDetails>
                <SubDetails>
                  <DetailTitle className="mt-3">RSK Mainnet</DetailTitle>
                  <DetailTitle className="mt-3">
                    https://public-node.rsk.co
                  </DetailTitle>
                  <DetailTitle className="mt-3">30</DetailTitle>
                  <DetailTitle className="mt-3">RBTC</DetailTitle>
                  <DetailTitle className="mt-3">
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

// const Wrapper = styled.div`
//   padding: 27px 5px;
//   border-top: 3px solid white;
//   border-bottom: 2px solid white;
//   margin: 17px 0;
// `;

// const StyledDialog = styled.div.attrs(_ => ({
//   className: 'bp3-dialog',
// }))`
//   background: #000000;
//   border-radius: 6px;
//   box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.2),
//     0 18px 46px 6px rgba(0, 0, 0, 0.2);
//   border: none;
//   display: flex;
//   flex-direction: column;
//   margin: 30px;
//   padding-bottom: 20px;
//   pointer-events: all;
//   user-select: text;
//   position: relative;
//   width: 100%;
//   padding: 40px !important;
//   ${media.lg`
//   width: 1235px;
//   padding: 40px 130px !important;
//   `}
// `;

// const Close = styled.button.attrs(_ => ({
//   type: 'button',
// }))`
//   background: url(${closeIcon}) center center no-repeat;
//   background-size: 52px 52px;
//   width: 52px;
//   height: 52px;
//   border: none;
//   cursor: pointer;
//   position: absolute;
//   top: 20px;
//   right: 20px;
//   z-index: 20;
//   padding: 0;
// `;

// const CloseButton = styled.button.attrs(_ => ({
//   type: 'button',
// }))`
//   background: none;
//   border: 1px solid var(--Gold);
//   color: var(--Gold);
//   border-radius: 10px;
//   padding: 14px 70px;
//   margin: 50px auto 0;
//   opacity: 0.2;
//   transition: opacity 0.5s;
//   will-change: opacity;
//   &:hover {
//     opacity: 1;
//   }
// `;

// const Title = styled.div`
//   font-size: 28px;
//   font-weight: 500;
//   text-align: center;
//   margin-bottom: 64px;
//   margin-top: 40px;
// `;
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
  font-size: 15px;
  font-weight: 500;
  text-align: left;
  color: white;
`;
const StepTitle = styled.div`
  font-size: 26px;
  font-weight: 500;
  text-align: left;
  color: white;
`;
const DetailTitle = styled.div`
  font-size: 12px;
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
  className: 'flex-grow-0 flex-shrink-0',
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
  className: 'flex-grow-0 flex-shrink-0 d-flex align-items-center',
}))`
  border: none;
  margin: 0 5px;
  width: 20px;
  height: 20px;
  padding: 0;
  background: none;
`;
