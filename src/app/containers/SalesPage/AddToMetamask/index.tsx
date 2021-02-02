import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components/macro';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Classes, Icon, Overlay, Text } from '@blueprintjs/core';
import { selectSalesPage } from '../selectors';
import { actions } from '../slice';
import { media } from 'styles/media';

import step1 from 'assets/images/genesis/meta_01.svg';
import step2 from 'assets/images/genesis/meta_02.svg';
import step3 from 'assets/images/genesis/meta_03.svg';
import step4 from 'assets/images/genesis/meta_04.svg';
import step5 from 'assets/images/genesis/meta_05.svg';
import step6 from 'assets/images/genesis/meta_06.svg';
import closeIcon from 'assets/images/genesis/close-24px.svg';
import { getTokenContract } from '../../../../utils/blockchain/contract-helpers';
import { Asset } from '../../../../types/asset';
import { prettyTx } from '../../../../utils/helpers';

interface IStep {
  title: string;
  image: any;
}

const steps: IStep[] = [
  { title: 'Step 01: In Metamask click “Add Token”', image: step1 },
  { title: 'Step 02: Select “Custom Token”', image: step2 },
  { title: 'Step 03: Enter SOV token settings', image: step3 },
  { title: 'Step 04: Select “Next”', image: step4 },
  { title: 'Step 05: Select “Add Token”', image: step5 },
  { title: 'Step 06: Click back to your account', image: step6 },
];

export function AddSoToMetamask() {
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
          <div className="w-100">
            <Close onClick={() => dispatch(actions.showTokenTutorial(false))} />
            <Title>How to connect SOV to your Metamask wallet</Title>
            <div className="d-flex flex-row justify-content-between align-items-center">
              <LeftBlock>
                <p className="text-center mb-3">{steps[step].title}</p>
                <div className="bg-white rounded p-4 text-center">
                  <img
                    src={steps[step].image}
                    alt={steps[step].title}
                    className="mx-auto"
                  />
                </div>
                <div className="d-flex flex-row justify-content-center align-items-center mt-3">
                  <NavBtn onClick={handleBack}>
                    <Icon
                      icon="caret-left"
                      iconSize={24}
                      className="text-white"
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
                      className="text-white"
                    />
                  </NavBtn>
                </div>
              </LeftBlock>
              <RightBlock>
                <SettingsTitle>SOV TOKEN SETTINGS</SettingsTitle>
                <Wrapper>
                  <div className="row mb-3">
                    <Text
                      className="col-6 font-weight-bold"
                      ellipsize
                      tagName="div"
                    >
                      Contract Address:
                    </Text>
                    <div className="col-6">
                      <CopyToClipboard
                        text={getTokenContract(Asset.CSOV).address}
                      >
                        <div className="d-flex flex-row justify-content-between align-items-center cursor-pointer font-weight-light">
                          <Text ellipsize tagName="div">
                            {prettyTx(getTokenContract(Asset.CSOV).address)}
                          </Text>
                          <div className="flex-shrink-0 flex-grow-0 ml-2">
                            <Icon icon="duplicate" intent="warning" />
                          </div>
                        </div>
                      </CopyToClipboard>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-6 font-weight-bold">Symbol:</div>
                    <div className="col-6">
                      <CopyToClipboard text="SOV">
                        <div className="d-flex flex-row justify-content-between align-items-center cursor-pointer font-weight-light">
                          <div>SOV</div>
                          <div className="flex-shrink-0 flex-grow-0 ml-2">
                            <Icon icon="duplicate" intent="warning" />
                          </div>
                        </div>
                      </CopyToClipboard>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6 font-weight-bold">Decimals:</div>
                    <div className="col-6">
                      <CopyToClipboard text={18}>
                        <div className="d-flex flex-row justify-content-between align-items-center cursor-pointer font-weight-light">
                          <div>18</div>
                          <div className="flex-shrink-0 flex-grow-0 ml-2">
                            <Icon icon="duplicate" intent="warning" />
                          </div>
                        </div>
                      </CopyToClipboard>
                    </div>
                  </div>
                </Wrapper>
                <div className="w-full d-flex flex-row justify-content-center align-items-center">
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
  text-align: center;
  margin-bottom: 64px;
  margin-top: 40px;
`;

const SettingsTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
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
