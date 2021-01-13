import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { Button, Classes, Overlay } from '@blueprintjs/core';
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

interface IStep {
  title: string;
  image: any;
}

const steps: IStep[] = [
  { title: 'Step 01: In Nifty click "Tokens"', image: step1 },
  { title: 'Step 02: In Nifty click "Tokens"', image: step2 },
  { title: 'Step 03: In Nifty click "Tokens"', image: step3 },
  { title: 'Step 04: In Nifty click "Tokens"', image: step4 },
  { title: 'Step 05: In Nifty click "Tokens"', image: step5 },
  { title: 'Step 06: In Nifty click "Tokens"', image: step6 },
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
          <div className="w-100">
            <Close onClick={() => dispatch(actions.showTokenTutorial(false))} />
            <Title>How to connect SOV to your Nifty wallet</Title>
            <div className="d-flex flex-row justify-content-between align-items-center">
              <div>
                <p className="text-center mb-3">{steps[step].title}</p>
                <div className="bg-white rounded p-4 text-center">
                  <img
                    src={steps[step].image}
                    alt={steps[step].title}
                    className="mx-auto"
                  />
                </div>
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <Button onClick={handleBack} minimal icon="caret-left" />
                  {steps.map((_, i) => (
                    <Button
                      onClick={() => setStep(i)}
                      minimal
                      icon="circle"
                      active={i === step}
                    />
                  ))}
                  <Button onClick={handleNext} minimal icon="caret-right" />
                </div>
              </div>
              <div>
                <div>SOV TOKEN SETTINGS</div>
                <div>
                  <div>Token Contract Address:</div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </StyledDialog>
      </div>
    </Overlay>
  );
}

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

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 64px;
  margin-top: 40px;
`;
