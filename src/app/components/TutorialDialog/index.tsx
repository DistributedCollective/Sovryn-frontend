import React, { useState } from 'react';
import browserImg from 'assets/images/tutorial/browser.svg';
import arm from 'assets/images/tutorial/ARM.png';
import stepBox from 'assets/images/tutorial/step-box.svg';
import background from 'assets/images/tutorial/test.svg';
import leftArrow from 'assets/images/tutorial/left_arrow.svg';
import rightArrow from 'assets/images/tutorial/right_arrow.svg';
import engage from 'assets/images/tutorial/engage.svg';
import close from 'assets/images/tutorial/close.svg';
import speechBubble from 'assets/images/tutorial/speech_bubble.svg';
import step2screen1 from 'assets/images/tutorial/step2screen1.svg';
import step3screen1 from 'assets/images/tutorial/step3screen1.svg';
import step4screen1 from 'assets/images/tutorial/step4screen1.svg';
import step5screen1 from 'assets/images/tutorial/step5screen1.svg';
import step6screen1 from 'assets/images/tutorial/step6screen1.svg';

export function TutorialDialog() {
  const [show, setShow] = useState<boolean>(true);
  const [step, setStep] = useState(1);

  const content = {
    1: {
      leftImage: browserImg,
      speech: 'Open up your browser wallet',
      armPosition: 'mid-high',
    },
    2: {
      leftImage: step2screen1,
      speech: 'Go to Network Selection',
      armPosition: 'high',
    },
    3: {
      leftImage: step3screen1,
      speech: 'Select custom RPC',
      armPosition: 'mid-low',
    },
    4: {
      leftImage: step4screen1,
      speech: 'Input network details',
      armPosition: 'center',
    },
    5: {
      leftImage: step5screen1,
      speech: 'Click Save',
      armPosition: 'low',
    },
    6: {
      leftImage: step6screen1,
      speech: 'Click Add Network',
      armPosition: 'low',
    },
  };

  const inputSettings = {
    'Network Name': 'RSK Mainnet',
    'New RPC URL': 'https://public-node.rsk.co',
    'Chain ID': '30',
    Symbol: 'RBTC',
    'Block Explorer URL': 'https://explorer.rsk.co',
  };

  return (
    <div className="wallet-tutorial_container">
      <div>
        <div className="background">
          <img src={background} alt="" />
        </div>
        <div className={`arm ${content[step].armPosition}`}>
          <img src={arm} alt="" />
        </div>
        <div className="speech">
          <img src={speechBubble} alt="" />
          <p>{content[step].speech}</p>
        </div>
        <div className="close">
          <img src={close} alt="close" />
        </div>
        <div className={`left-box ${step === 1 && 'browser'}`}>
          <img src={content[step].leftImage} alt="" />
        </div>
        <div className="right-box">
          <div>
            <p>Input settings</p>
            <div>
              <div className="row">
                <div className="col-5">Network Name</div>
                <div className="col-7"></div>
              </div>
              <div className="row">
                <div className="col-5">New RPC URL</div>
                <div className="col-7"></div>
              </div>
              <div className="row">
                <div className="col-5">Chain ID</div>
                <div className="col-7"></div>
              </div>
              <div className="row">
                <div className="col-5">Symbol</div>
                <div className="col-7"></div>
              </div>
              <div className="row">
                <div className="col-5">Block Explorer URL</div>
                <div className="col-7"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="step-box">
          <img src={stepBox} alt="" />
          <p>Step {step}</p>
        </div>
        <div className="stepper">
          <div className="d-flex flex-row">
            <img
              src={leftArrow}
              alt="left arrow"
              onClick={() =>
                setStep(prevState => (step > 1 ? prevState - 1 : 1))
              }
            />
            <div
              className={`stepper_circle ${step === 1 && 'active'}`}
              onClick={() => setStep(1)}
            ></div>
            <div
              className={`stepper_circle ${step === 2 && 'active'}`}
              onClick={() => setStep(2)}
            ></div>
            <div
              className={`stepper_circle ${step === 3 && 'active'}`}
              onClick={() => setStep(3)}
            ></div>
            <div
              className={`stepper_circle ${step === 4 && 'active'}`}
              onClick={() => setStep(4)}
            ></div>
            <div
              className={`stepper_circle ${step === 5 && 'active'}`}
              onClick={() => setStep(5)}
            ></div>
            <div
              className={`stepper_circle ${step === 6 && 'active'}`}
              onClick={() => setStep(6)}
            ></div>
            <img
              src={rightArrow}
              alt="right arrow"
              onClick={() =>
                setStep(prevState => (step < 6 ? prevState + 1 : 6))
              }
            />
          </div>
        </div>
        <div className="banner">
          <p>Join us on discord...</p>
        </div>
        <div className="engage">
          <img src={engage} alt="engage button" />
        </div>
      </div>
    </div>
  );
}
