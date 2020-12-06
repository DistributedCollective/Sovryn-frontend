import React, { useState, useEffect } from 'react';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import arm1 from 'assets/images/tutorial/arm_1.svg';
import arm2 from 'assets/images/tutorial/arm_2.svg';
import stepBox from 'assets/images/tutorial/step-box.svg';
import leftArrow from 'assets/images/tutorial/left_arrow.svg';
import rightArrow from 'assets/images/tutorial/right_arrow.svg';
import engage from 'assets/images/tutorial/engage.svg';
import speechBubble from 'assets/images/tutorial/speech_bubble.svg';
import leftBox from 'assets/images/tutorial/left_box.svg';
import rightBox from 'assets/images/tutorial/right_box.svg';
import badgerBody from 'assets/images/tutorial/badger_body.svg';
import crater from 'assets/images/tutorial/crater.svg';
import { Icon } from '@blueprintjs/core';
import { useContent } from '../../../hooks/tutorial/useContent';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface Props {
  onNetwork: boolean;
  mouseLeave: boolean;
  activeTutorial: boolean;
  handleEngage: () => void;
}

export function Screen2(props: Props) {
  const { t } = useTranslation();
  const content = useContent();
  const [cycle, setCycle] = useState(false);
  const [step, setStep] = useState(props.activeTutorial === true ? 7 : 1);
  const [speechText, setSpeechText] = useState(
    props.activeTutorial ? content[7].speech : content[1].speech,
  );
  const [moving, setMoving] = useState(false);

  // const timer = ms => new Promise(res => setTimeout(res, ms));

  //   useEffect(() => {
  //     setTimeout(function () {
  //       setMoving(false);
  //     }, 1000);
  //   });

  // async function printText(str) {
  //   await timer(500);
  //   setSpeechText('');
  //   for (let i = 0; i < str.length; i++) {
  //     setSpeechText(prevState => `${prevState}${str[i]}`);
  //     await timer(50);
  //   }
  // }

  function stepChange(num) {
    setStep(num);
    setCycle(false);
    setSpeechText(content[num].speech);
    // printText(content[num].speech);
  }

  useEffect(() => {
    if (cycle) {
      const interval = setInterval(() => {
        setStep(prevState => (step < 7 ? prevState + 1 : 1));
        setSpeechText(content[step === 7 ? 1 : step + 1].speech);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [step, cycle, content]);

  useEffect(() => {
    if (props.onNetwork) {
      setCycle(false);
    }
  }, [props.onNetwork]);

  useEffect(() => {
    if (props.mouseLeave === true) {
      setCycle(true);
    }
  }, [props.mouseLeave]);

  return (
    <>
      {!moving && (
        <>
          <div className="crater position-absolute">
            <img src={crater} alt="" className="w-100 h-100" />
          </div>
          <div className={`arm_${step} position-absolute`}>
            <div className="arm1 position-absolute">
              <img src={arm1} alt="" className="h-100 w-100" />
            </div>
            <div className="arm2 position-relative">
              <img src={arm2} alt="" className="h-100 w-100" />
            </div>
          </div>
          <div className="badger-body position-absolute">
            <img src={badgerBody} alt="" className="h-100 w-100" />
          </div>
          <div className={`speech step${step}`}>
            <img src={speechBubble} alt="" />
            <p>{speechText}</p>
          </div>

          <div className="left-box_outline position-absolute">
            <img src={leftBox} alt="" className="h-100 w-100" />
          </div>
          <div
            className={`left-box position-absolute ${step === 1 && 'browser'}`}
          >
            <img src={content[step].leftImage} alt="" />
          </div>
          <div className="right-box_outline position-absolute">
            <img src={rightBox} alt="" className="h-100 w-100" />
          </div>
          <div className="right-box position-absolute">
            <div>
              <div>
                <div className="row">
                  <p className="text-center mx-auto">
                    {t(translations.rskConnectTutorial.input_settings.title)}
                  </p>
                </div>
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
                  <div className="col-7">
                    <CopyToClipboard
                      text="https://public-node.rsk.co"
                      onCopy={() => alert('Copied!')}
                    >
                      <span className="cursor-pointer">
                        https://public-node.rsk.co <Icon icon="duplicate" />
                      </span>
                    </CopyToClipboard>
                  </div>
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
                  <div className="col-7">
                    <CopyToClipboard
                      text="https://public-node.rsk.co"
                      onCopy={() => alert('Copied!')}
                    >
                      <span className="cursor-pointer">
                        https://explorer.rsk.co <Icon icon="duplicate" />
                      </span>
                    </CopyToClipboard>
                  </div>
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
              <div
                className={`stepper_circle ${step === 7 && 'active'}`}
                onClick={() => stepChange(7)}
              ></div>
              <img
                src={rightArrow}
                alt="right arrow"
                onClick={() => (step < 7 ? stepChange(step + 1) : null)}
              />
            </div>
          </div>
          <div
            className={`engage ${props.onNetwork && 'active'}`}
            onClick={props.handleEngage}
          >
            <img src={engage} alt="engage button" />
          </div>
        </>
      )}
    </>
  );
}
