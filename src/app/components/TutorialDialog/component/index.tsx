import React, { useState, useEffect } from 'react';
import arm from 'assets/images/tutorial/ARM.png';
import stepBox from 'assets/images/tutorial/step-box.svg';
import background from 'assets/images/tutorial/test.svg';
import leftArrow from 'assets/images/tutorial/left_arrow.svg';
import rightArrow from 'assets/images/tutorial/right_arrow.svg';
import engage from 'assets/images/tutorial/engage.svg';
import close from 'assets/images/tutorial/close.svg';
import speechBubble from 'assets/images/tutorial/speech_bubble.svg';
import { useContent } from '../../../hooks/tutorial/useContent';

import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

export function TutorialDialogComponent(props) {
  const { t } = useTranslation();
  const content = useContent();
  const [cycle, setCycle] = useState(true);
  const [step, setStep] = useState(1);
  const [speechText, setSpeechText] = useState(content[1].speech);

  const timer = ms => new Promise(res => setTimeout(res, ms));

  async function printText(str) {
    await timer(500);
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
  }, [step, cycle, content]);

  useEffect(() => {
    if (props.onMainnet) {
      setCycle(false);
    }
  }, [props.onMainnet]);

  return (
    <>
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
          <div className="close" onClick={props.handleClose}>
            <img src={close} alt="close" />
          </div>
          <div className={`left-box ${step === 1 && 'browser'}`}>
            <img src={content[step].leftImage} alt="" />
          </div>
          <div className="right-box">
            <div>
              <p>{t(translations.rskConnectTutorial.input_settings.title)}</p>
              <div>
                <div className="row">
                  <div className="col-5">
                    {t(translations.rskConnectTutorial.input_settings.network)}
                  </div>
                  <div className="col-7">RSK Mainnet</div>
                </div>
                <div className="row">
                  <div className="col-5">
                    {t(translations.rskConnectTutorial.input_settings.new_RPC)}
                  </div>
                  <div className="col-7">https://public-node.rsk.co</div>
                </div>
                <div className="row">
                  <div className="col-5">
                    {t(translations.rskConnectTutorial.input_settings.chain_Id)}
                  </div>
                  <div className="col-7">30</div>
                </div>
                <div className="row">
                  <div className="col-5">
                    {t(translations.rskConnectTutorial.input_settings.symbol)}
                  </div>
                  <div className="col-7">RBTC</div>
                </div>
                <div className="row">
                  <div className="col-5">
                    {t(
                      translations.rskConnectTutorial.input_settings
                        .explorer_url,
                    )}
                  </div>
                  <div className="col-7">https://explorer.rsk.co</div>
                </div>
              </div>
            </div>
          </div>
          <div className="step-box">
            <img src={stepBox} alt="" />
            <p>
              {t(translations.rskConnectTutorial.step)}: <b>0{step}</b>
            </p>
          </div>
          <div className="stepper">
            <div className="d-flex flex-row">
              <img
                src={leftArrow}
                alt="left arrow"
                onClick={() => (step > 1 ? stepChange(step - 1) : null)}
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
                onClick={() => (step < 6 ? stepChange(step + 1) : null)}
              />
            </div>
          </div>
          <div className="banner">
            <p>
              {t(translations.rskConnectTutorial.banner)}{' '}
              <a
                href="https://discord.com/invite/J22WS6z"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://discord.com/invite/J22WS6z
              </a>
            </p>
          </div>
          <div
            className={`engage ${props.onMainnet && 'active'}`}
            onClick={props.handleEngage}
          >
            <img src={engage} alt="engage button" />
          </div>
        </div>
      </div>
    </>
  );
}
