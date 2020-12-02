import React, { useState, useEffect } from 'react';
import arm from 'assets/images/tutorial/ARM.png';
import stepBox from 'assets/images/tutorial/step-box.svg';
import background from 'assets/images/tutorial/test.svg';
import leftArrow from 'assets/images/tutorial/left_arrow.svg';
import rightArrow from 'assets/images/tutorial/right_arrow.svg';
import engage from 'assets/images/tutorial/engage.svg';
import close from 'assets/images/tutorial/close.svg';
import speechBubble from 'assets/images/tutorial/speech_bubble.svg';
import { content } from './content';
import { useIsConnected } from 'app/hooks/useAccount';

export function TutorialDialog() {
  const [show, setShow] = useState<boolean>(false);
  const [cycle, setCycle] = useState(true);
  const [step, setStep] = useState(1);
  const [speechText, setSpeechText] = useState(content[1].speech);
  const previousUser =
    window.localStorage.getItem('connectedToRskBefore') === 'true';
  const connected = useIsConnected();
  const closed = window.sessionStorage.getItem('closedRskTutorial');

  //Check if user is currently connected

  //On close, save preference in session storage

  function handleClose() {
    window.sessionStorage.setItem('closedRskTutorial', 'true');
    setShow(false);
  }

  //On open, check session storage for preference

  useEffect(() => {
    if ((!previousUser && !connected) || closed !== 'true') {
      setShow(true);
    }
  }, [previousUser, closed, connected]);

  const timer = ms => new Promise(res => setTimeout(res, ms));

  async function printText(str) {
    await timer(200);
    setSpeechText('');
    for (let i = 0; i < str.length; i++) {
      setSpeechText(prevState => `${prevState}${str[i]}`);
      await timer(50);
    }
  }

  function stepChange(num) {
    setSpeechText('');
    setStep(num);
    setCycle(false);
    printText(content[num].speech);
  }

  useEffect(() => {
    if (cycle) {
      const interval = setInterval(() => {
        setStep(prevState => (step < 6 ? prevState + 1 : 1));
        setSpeechText(content[step === 6 ? 1 : step + 1].speech);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [step, cycle]);

  return (
    <>
      {show && (
        <div className="wallet-tutorial_container">
          <div>
            <div className="background">
              <img src={background} alt="" />
            </div>
            <div className={`arm ${content[step].armPosition}`}>
              <img src={arm} alt="" />
            </div>
            <div className={`speech step${step}`}>
              <img src={speechBubble} alt="" />
              <p>{speechText}</p>
            </div>
            <div className="close" onClick={handleClose}>
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
                    <div className="col-7">RSK Mainnet</div>
                  </div>
                  <div className="row">
                    <div className="col-5">New RPC URL</div>
                    <div className="col-7">https://public-node.rsk.co</div>
                  </div>
                  <div className="row">
                    <div className="col-5">Chain ID</div>
                    <div className="col-7">30</div>
                  </div>
                  <div className="row">
                    <div className="col-5">Symbol</div>
                    <div className="col-7">RBTC</div>
                  </div>
                  <div className="row">
                    <div className="col-5">Block Explorer URL</div>
                    <div className="col-7">https://explorer.rsk.co</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="step-box">
              <img src={stepBox} alt="" />
              <p>
                Step: <b>0{step}</b>
              </p>
            </div>
            <div className="stepper">
              <div className="d-flex flex-row">
                <img
                  src={leftArrow}
                  alt="left arrow"
                  onClick={() => stepChange(step > 1 ? step - 1 : 1)}
                />
                <div
                  className={`stepper_circle ${step === 1 && 'active'}`}
                  onClick={() => stepChange(1)}
                ></div>
                <div
                  className={`stepper_circle ${step === 2 && 'active'}`}
                  onClick={() => stepChange(2)}
                ></div>
                <div
                  className={`stepper_circle ${step === 3 && 'active'}`}
                  onClick={() => stepChange(3)}
                ></div>
                <div
                  className={`stepper_circle ${step === 4 && 'active'}`}
                  onClick={() => stepChange(4)}
                ></div>
                <div
                  className={`stepper_circle ${step === 5 && 'active'}`}
                  onClick={() => stepChange(5)}
                ></div>
                <div
                  className={`stepper_circle ${step === 6 && 'active'}`}
                  onClick={() => stepChange(6)}
                ></div>
                <img
                  src={rightArrow}
                  alt="right arrow"
                  onClick={() => stepChange(step < 6 ? step + 1 : 6)}
                />
              </div>
            </div>
            <div className="banner">
              <p>
                For any assistance, reach out to the community (DISCORD INVITE
                LINK)
              </p>
            </div>
            <div className="engage">
              <img src={engage} alt="engage button" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
