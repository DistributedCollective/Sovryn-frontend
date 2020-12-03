import React, { useState, useEffect } from 'react';
import background from 'assets/images/tutorial/test.svg';
import close from 'assets/images/tutorial/close.svg';
import { Screen1 } from '../screen1';
import { Screen11 } from '../Screen1_1';
import { Screen2 } from '../screen2';

import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

export function TutorialDialogComponent(props) {
  const { t } = useTranslation();
  const [screen, setScreen] = useState(1);

  function changeScreen(num) {
    setScreen(num);
  }

  return (
    <>
      <div className="wallet-tutorial_container">
        <div>
          <div className="background">
            <img src={background} alt="" />
          </div>
          <div className="close" onClick={props.handleClose}>
            <img src={close} alt="close" />
          </div>
          <div className="title position-absolute">
            <h1>
              {t(
                translations.rskConnectTutorial.screens[screen.toString()]
                  .title,
              )}
            </h1>
          </div>
          <div className="banner">
            <p>
              {t(
                translations.rskConnectTutorial.screens[screen.toString()]
                  .banner,
              )}{' '}
              <a
                href="https://discord.com/invite/J22WS6z"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://discord.com/invite/J22WS6z
              </a>
            </p>
          </div>
          {screen === 1 && (
            <Screen1
              handleClick={changeScreen}
              onMainnet={props.onMainnet}
              handleEngage={props.handleEngage}
            />
          )}
          {screen === 11 && <Screen11 />}
          {screen === 2 && (
            <Screen2
              onMainnet={props.onMainnet}
              handleEngage={props.handleEngage}
            />
          )}
        </div>
      </div>
    </>
  );
}
