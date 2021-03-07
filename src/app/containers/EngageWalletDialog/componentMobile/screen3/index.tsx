import React, { useState } from 'react';
import screen3Container from 'assets/images/tutorial/mobile_bg_3.svg';
import close from 'assets/images/tutorial/close.svg';
import leftArrow from 'assets/images/tutorial/mobile_left_arrow.svg';
import rightArrow from 'assets/images/tutorial/mobile_right_arrow.svg';

import { Icon } from '@blueprintjs/core';
import { useContent } from '../../../../hooks/tutorial/useContent';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

export function Screen3(props) {
  const { t } = useTranslation();
  const content = useContent();
  const [step, setStep] = useState(1);
  const [speechText, setSpeechText] = useState(content[1].mobileSpeech);

  function stepChange(num) {
    setStep(num);
    setSpeechText(content[num].mobileSpeech);
    // printText(content[num].speech);
  }

  const deepLinks = {
    Metamask: 'https://metamask.app.link/dapp/live.sovryn.app/',
    Trust:
      'https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url=' +
      'live.sovryn.app',
  };

  return (
    <>
      <div className="tw-absolute screen3">
        <img className="tw-w-full tw-h-full" src={screen3Container} alt="" />
        <div className="title tw-absolute">
          <p>Connecting to the RSK Network</p>
        </div>
        <div className="close--3 tw-absolute" onClick={() => props.handleClose}>
          <img className="tw-w-full tw-h-full" src={close} alt="close" />
        </div>
        <div className={`step-image tw-absolute`}>
          <img
            src={content[step].mobileWalletImage}
            alt=""
            className="tw-h-full tw-w-full"
          />
        </div>
        <div className="step-description tw-absolute">
          <p>
            Step: 0{step} - {speechText}
          </p>
        </div>
        <div className="stepper tw-absolute">
          <div className="tw-flex tw-flex-row">
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
              className="right-arrow"
              src={rightArrow}
              alt="right arrow"
              onClick={() => (step < 6 ? stepChange(step + 1) : null)}
            />
          </div>
        </div>
        <div className="settings tw-absolute">
          <div className="tw-grid tw-grid-cols-12">
            <div className="tw-text-center tw-col-span-12">
              {t(translations.rskConnectTutorial.input_settings.title)}
            </div>
          </div>
          <div className="tw-grid tw-grid-cols-12">
            <div className="tw-col-span-4">
              {t(translations.rskConnectTutorial.input_settings.network)}:
            </div>
            <div className="tw-col-span-8">RSK Mainnet</div>
          </div>
          <div className="tw-grid tw-grid-cols-12">
            <div className="tw-col-span-4">
              {t(translations.rskConnectTutorial.input_settings.new_RPC)}:
            </div>
            <div className="tw-col-span-8">
              <CopyToClipboard
                text="https://public-node.rsk.co"
                onCopy={() => alert('Copied!')}
              >
                <span className="tw-cursor-pointer">
                  https://public-node.rsk.co{' '}
                  <Icon icon="duplicate" iconSize={10} />
                </span>
              </CopyToClipboard>
            </div>
          </div>
          <div className="tw-grid tw-grid-cols-12">
            <div className="tw-col-span-4">
              {t(translations.rskConnectTutorial.input_settings.chain_Id)}:
            </div>
            <div className="tw-col-span-8">30</div>
          </div>
          <div className="tw-grid tw-grid-cols-12">
            <div className="tw-col-span-4">
              {t(translations.rskConnectTutorial.input_settings.symbol)}:
            </div>
            <div className="tw-col-span-8">RBTC</div>
          </div>
          <div className="tw-grid tw-grid-cols-12">
            <div className="tw-col-span-4">
              {t(translations.rskConnectTutorial.input_settings.explorer_url)}:
            </div>
            <div className="tw-col-span-8">
              <CopyToClipboard
                text="https://public-node.rsk.co"
                onCopy={() => alert('Copied!')}
              >
                <span className="tw-cursor-pointer">
                  https://explorer.rsk.co{' '}
                  <Icon icon="duplicate" iconSize={10} />
                </span>
              </CopyToClipboard>
            </div>
          </div>
        </div>
        <a href={deepLinks[props.wallet]}>
          <div className="open-wallet tw-absolute tw-rounded tw-py-4 tw-px-12">
            <p className="tw-m-0">Open {props.wallet}</p>
          </div>
        </a>
      </div>
    </>
  );
}
