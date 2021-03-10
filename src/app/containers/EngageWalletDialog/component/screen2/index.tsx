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
import { useContent } from '../../../../hooks/tutorial/useContent';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  blockExplorers,
  currentChainId,
  networkNames,
  rpcNodes,
} from '../../../../../utils/classifiers';

interface Props {
  onNetwork: boolean;
  mouseLeave: boolean;
  activeTutorial: boolean;
  handleEngage: (wallet?: string) => void;
}

export function Screen2(props: Props) {
  const { t } = useTranslation();
  const content = useContent();
  const [cycle, setCycle] = useState(false);
  const [step, setStep] = useState(props.activeTutorial ? 7 : 1);
  const [speechText, setSpeechText] = useState(
    props.activeTutorial ? content[7].speech : content[1].speech,
  );

  function stepChange(num) {
    setStep(num);
    setCycle(false);
    setSpeechText(content[num].speech);
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
    if (props.mouseLeave) {
      setCycle(true);
    }
  }, [props.mouseLeave]);

  return (
    <>
      <div className="crater tw-absolute">
        <img src={crater} alt="" className="tw-w-full tw-h-full" />
      </div>
      <div className={`arm_${step} tw-absolute`}>
        <div className="arm1 tw-absolute">
          <img src={arm1} alt="" className="tw-h-full tw-w-full" />
        </div>
        <div className="arm2 tw-relative">
          <img src={arm2} alt="" className="tw-h-full tw-w-full" />
        </div>
      </div>
      <div className="badger-body tw-absolute">
        <img src={badgerBody} alt="" className="tw-h-full tw-w-full" />
      </div>
      <div className={`speech step${step}`}>
        <img src={speechBubble} alt="" />
        <p>{speechText}</p>
      </div>

      <div className="left-box_outline tw-absolute">
        <img src={leftBox} alt="" className="tw-h-full tw-w-full" />
      </div>
      <div className={`left-box tw-absolute ${step === 1 && 'browser'}`}>
        <img src={content[step].leftImage} alt="" />
      </div>
      <div className="right-box_outline tw-absolute">
        <img src={rightBox} alt="" className="tw-h-full tw-w-full" />
      </div>
      <div className="right-box tw-absolute">
        <div>
          <div>
            <div className="tw-grid tw-gap-8 tw-grid-cols-12">
              <p className="tw-text-center tw-mx-auto">
                {t(translations.rskConnectTutorial.input_settings.title)}
              </p>
            </div>
            <div className="tw-grid tw-gap-8 tw-grid-cols-12">
              <div className="tw-col-span-5">
                {t(translations.rskConnectTutorial.input_settings.network)}
              </div>
              <div className="tw-col-span-7">
                {networkNames[currentChainId]}
              </div>
            </div>
            <div className="tw-grid tw-gap-8 tw-grid-cols-12">
              <div className="tw-col-span-5">
                {t(translations.rskConnectTutorial.input_settings.new_RPC)}
              </div>
              <div className="tw-col-span-7">
                <CopyToClipboard text={rpcNodes[currentChainId]}>
                  <span className="tw-cursor-pointer">
                    {rpcNodes[currentChainId]} <Icon icon="duplicate" />
                  </span>
                </CopyToClipboard>
              </div>
            </div>
            <div className="tw-grid tw-gap-8 tw-grid-cols-12">
              <div className="tw-col-span-5">
                {t(translations.rskConnectTutorial.input_settings.chain_Id)}
              </div>
              <div className="tw-col-span-7">{currentChainId}</div>
            </div>
            <div className="tw-grid tw-gap-8 tw-grid-cols-12">
              <div className="tw-col-span-5">
                {t(translations.rskConnectTutorial.input_settings.symbol)}
              </div>
              <div className="tw-col-span-7">RBTC</div>
            </div>
            <div className="tw-grid tw-gap-8 tw-grid-cols-12">
              <div className="tw-col-span-5">
                {t(translations.rskConnectTutorial.input_settings.explorer_url)}
              </div>
              <div className="tw-col-span-7">
                <CopyToClipboard text={blockExplorers[currentChainId]}>
                  <span className="tw-cursor-pointer">
                    {blockExplorers[currentChainId]} <Icon icon="duplicate" />
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
        <div className="tw-flex tw-flex-row">
          <img
            src={leftArrow}
            alt="left arrow"
            onClick={() => (step > 1 ? stepChange(step - 1) : null)}
          />
          <div
            className={`stepper_circle ${step === 1 && 'active'}`}
            onClick={() => stepChange(1)}
          />
          <div
            className={`stepper_circle ${step === 2 && 'active'}`}
            onClick={() => stepChange(2)}
          />
          <div
            className={`stepper_circle ${step === 3 && 'active'}`}
            onClick={() => stepChange(3)}
          />
          <div
            className={`stepper_circle ${step === 4 && 'active'}`}
            onClick={() => stepChange(4)}
          />
          <div
            className={`stepper_circle ${step === 5 && 'active'}`}
            onClick={() => stepChange(5)}
          />
          <div
            className={`stepper_circle ${step === 6 && 'active'}`}
            onClick={() => stepChange(6)}
          />
          <div
            className={`stepper_circle ${step === 7 && 'active'}`}
            onClick={() => stepChange(7)}
          />
          <img
            src={rightArrow}
            alt="right arrow"
            onClick={() => (step < 7 ? stepChange(step + 1) : null)}
          />
        </div>
      </div>
      <div
        className={`engage ${props.onNetwork && 'active'}`}
        onClick={() => props.handleEngage('injected')}
      >
        <img src={engage} alt="engage button" />
      </div>
    </>
  );
}
