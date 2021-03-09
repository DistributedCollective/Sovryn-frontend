import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components/macro';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Classes, Icon, Overlay, Text } from '@blueprintjs/core';
import { selectSalesPage } from '../selectors';
import { actions } from '../slice';
import { media } from 'styles/media';

import step1 from 'assets/images/genesis/tut_01.svg';
import step2 from 'assets/images/genesis/tut_02.svg';
import step3 from 'assets/images/genesis/tut_03.svg';
import step4 from 'assets/images/genesis/tut_04.svg';
import step5 from 'assets/images/genesis/tut_05.svg';
import step6 from 'assets/images/genesis/tut_06.svg';
import closeIcon from 'assets/images/genesis/close-24px.svg';
import { getTokenContract } from '../../../../utils/blockchain/contract-helpers';
import { Asset } from '../../../../types/asset';
import { prettyTx } from '../../../../utils/helpers';

interface IStep {
  title: string;
  image: any;
}

const steps: IStep[] = [
  { title: 'Step 01: In Nifty click “Tokens”', image: step1 },
  { title: 'Step 02: Click “Add Token”', image: step2 },
  { title: 'Step 03: Select “Custom”', image: step3 },
  { title: 'Step 04: Enter SOV token settings', image: step4 },
  { title: 'Step 05: Click “Add”', image: step5 },
  { title: 'Step 06: SOV is successfully added ', image: step6 },
];

export function AddSoToNifty() {
  const dispatch = useDispatch();
  const { showTokenTutorial } = useSelector(selectSalesPage);

  const [step, setStep] = useState(0);

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
    <Overlay
      isOpen={showTokenTutorial}
      onClose={() => dispatch(actions.showTokenTutorial(false))}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      hasBackdrop
    >
      <div className={Classes.DIALOG_CONTAINER}>
        <StyledDialog>
          <div className="tw-w-full">
            <Close onClick={() => dispatch(actions.showTokenTutorial(false))} />
            <Title>How to connect SOV to your Nifty wallet</Title>
            <div className="tw-flex tw-flex-row tw-justify-between tw-items-center">
              <LeftBlock>
                <p className="tw-text-center tw-mb-4">{steps[step].title}</p>
                <div className="tw-bg-white tw-rounded tw-p-6 tw-text-center">
                  <img
                    src={steps[step].image}
                    alt={steps[step].title}
                    className="tw-mx-auto"
                  />
                </div>
                <div className="tw-flex tw-flex-row tw-justify-center tw-items-center tw-mt-4">
                  <NavBtn onClick={handleBack}>
                    <Icon
                      icon="caret-left"
                      iconSize={24}
                      className="tw-text-white"
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
                      className="tw-text-white"
                    />
                  </NavBtn>
                </div>
              </LeftBlock>
              <RightBlock>
                <SettingsTitle>SOV TOKEN SETTINGS</SettingsTitle>
                <Wrapper>
                  <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-mb-4">
                    <Text
                      className="tw-col-span-6 tw-font-bold"
                      ellipsize
                      tagName="div"
                    >
                      Contract Address:
                    </Text>
                    <div className="tw-col-span-6">
                      <CopyToClipboard
                        text={getTokenContract(Asset.CSOV).address}
                      >
                        <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-cursor-pointer tw-font-light">
                          <Text ellipsize tagName="div">
                            {prettyTx(getTokenContract(Asset.CSOV).address)}
                          </Text>
                          <div className="tw-flex-shrink-0 tw-flex-grow-0 tw-ml-2">
                            <Icon icon="duplicate" intent="warning" />
                          </div>
                        </div>
                      </CopyToClipboard>
                    </div>
                  </div>
                  <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-mb-4">
                    <div className="tw-col-span-6 tw-font-bold">Symbol:</div>
                    <div className="tw-col-span-6">
                      <CopyToClipboard text="SOV">
                        <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-cursor-pointer tw-font-light">
                          <div>SOV</div>
                          <div className="tw-flex-shrink-0 tw-flex-grow-0 tw-ml-2">
                            <Icon icon="duplicate" intent="warning" />
                          </div>
                        </div>
                      </CopyToClipboard>
                    </div>
                  </div>
                  <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12">
                    <div className="tw-col-span-6 tw-font-bold">Decimals:</div>
                    <div className="tw-col-span-6">
                      <CopyToClipboard text={18}>
                        <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-cursor-pointer tw-font-light">
                          <div>18</div>
                          <div className="tw-flex-shrink-0 tw-flex-grow-0 tw-ml-2">
                            <Icon icon="duplicate" intent="warning" />
                          </div>
                        </div>
                      </CopyToClipboard>
                    </div>
                  </div>
                </Wrapper>
                <div className="tw-w-full tw-flex tw-flex-row tw-justify-center tw-items-center">
                  <CloseButton
                    onClick={() => dispatch(actions.showTokenTutorial(false))}
                  >
                    Close
                  </CloseButton>
                </div>
              </RightBlock>
            </div>
          </div>
        </StyledDialog>
      </div>
    </Overlay>
  );
}

const Wrapper = styled.div`
  padding: 27px 5px;
  border-top: 3px solid white;
  border-bottom: 2px solid white;
  margin: 17px 0;
`;

const StyledDialog = styled.div.attrs(_ => ({
  className: 'bp3-dialog',
}))`
  background: #000000;
  border-radius: 6px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.2),
    0 18px 46px 6px rgba(0, 0, 0, 0.2);
  border: none;
  display: flex;
  flex-direction: column;
  margin: 30px;
  padding-bottom: 20px;
  pointer-events: all;
  user-select: text;
  position: relative;
  width: 100%;
  padding: 40px !important;
  ${media.lg`
  width: 1235px;
  padding: 40px 130px !important;
  `}
`;

const Close = styled.button.attrs(_ => ({
  type: 'button',
}))`
  background: url(${closeIcon}) center center no-repeat;
  background-size: 52px 52px;
  width: 52px;
  height: 52px;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;
  padding: 0;
`;

const CloseButton = styled.button.attrs(_ => ({
  type: 'button',
}))`
  background: none;
  border: 1px solid var(--Gold);
  color: var(--Gold);
  border-radius: 10px;
  padding: 14px 70px;
  margin: 50px auto 0;
  opacity: 0.2;
  transition: opacity 0.5s;
  will-change: opacity;
  &:hover {
    opacity: 1;
  }
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  tw-text-align: center;
  margin-bottom: 64px;
  margin-top: 40px;
`;

const SettingsTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  tw-text-align: center;
`;

const LeftBlock = styled.div`
  width: 100%;
  max-width: 312px;
  margin-right: 30px;
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
