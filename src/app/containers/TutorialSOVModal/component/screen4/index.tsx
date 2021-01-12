import React, { useState } from 'react';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { Icon } from '@blueprintjs/core';
import { useContent } from '../../../../hooks/tutorial/useContent';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export function Screen4(props) {
  const { t } = useTranslation();
  const content = useContent();
  const [step, setStep] = useState(1);
  const [speechText, setSpeechText] = useState(content[1].mobileSpeech);

  function stepChange(num) {
    setStep(num);
    setSpeechText(content[num].mobileSpeech);
  }

  return (
    <>
      <div className={`speech step${step}`}>
        <p>{speechText}</p>
      </div>

      <div className="left-box_outline position-absolute"></div>
      <div className={`left-box position-absolute`}>
        <img src={content[step].mobileWalletImage} alt="" />
      </div>

      <div className="right-box position-absolute">
        <div>
          <div>
            <div className="row">
              <p className="text-center mx-auto">
                {t(translations.SOVConnectTutorial.input_settings.title)}
              </p>
            </div>
            <div className="row">
              <div className="col-5">
                {t(
                  translations.SOVConnectTutorial.input_settings.token_address,
                )}
              </div>
              <div className="col-7">
                <CopyToClipboard
                  text="0x04fa98……..49e5740D"
                  onCopy={() => alert('Copied!')}
                >
                  <span className="cursor-pointer d-flex justify-content-between w-100">
                    0x04fa98.....49e5740D <Icon icon="duplicate" />
                  </span>
                </CopyToClipboard>
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                {t(translations.SOVConnectTutorial.input_settings.symbol)}
              </div>
              <div className="col-7">
                <CopyToClipboard text="SOV" onCopy={() => alert('Copied!')}>
                  <span className="cursor-pointer d-flex justify-content-between w-100">
                    SOV <Icon icon="duplicate" />
                  </span>
                </CopyToClipboard>
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                {t(translations.SOVConnectTutorial.input_settings.decimals)}
              </div>
              <div className="col-7">
                <CopyToClipboard text="18" onCopy={() => alert('Copied!')}>
                  <span className="cursor-pointer d-flex justify-content-between w-100">
                    18 <Icon icon="duplicate" />
                  </span>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stepper">
        <div className="d-flex flex-row">
          <Icon
            icon="chevron-left"
            iconSize={20}
            color="white"
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
          <Icon
            icon="chevron-right"
            iconSize={20}
            color="white"
            onClick={() => (step < 7 ? stepChange(step + 1) : null)}
          />
        </div>
      </div>

      <div
        className={`scan-qr-button ${step === 7 && 'active'} position-absolute`}
        onClick={() => props.handleClick()}
      >
        Close
      </div>
    </>
  );
}
