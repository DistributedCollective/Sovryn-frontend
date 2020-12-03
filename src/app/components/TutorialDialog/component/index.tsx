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
  const [mouseLeave, setMouseLeave] = useState(false);
  const activeTutorial =
    window.localStorage.getItem('tutorial_active') === 'true' &&
    props.onNetwork === true
      ? true
      : false;
  const [screen, setScreen] = useState(activeTutorial ? 2 : 1);

  function changeScreen(num) {
    setScreen(num);
  }

  return (
    <>
      <div
        className="wallet-tutorial_container"
        onMouseLeave={() => {
          console.log('Mouse out');
          if (screen === 2) {
            setMouseLeave(true);
          }
        }}
      >
        <div className={`${screen === 2 && 'left'} position-absolute`}>
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
              {screen === 1 && (
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Metamask.io
                </a>
              )}
              {screen !== 1 && (
                <a
                  href="https://discord.com/invite/J22WS6z"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://discord.com/invite/J22WS6z
                </a>
              )}
            </p>
          </div>
          {/* <Screen2
            onMainnet={props.onMainnet}
            handleEngage={props.handleEngage}
            mouseLeave={mouseLeave}
          /> */}
          {screen === 1 && (
            <Screen1
              handleClick={changeScreen}
              onNetwork={props.onNetwork}
              handleEngage={props.handleEngage}
            />
          )}
          {screen === 2 && (
            <Screen2
              onNetwork={props.onNetwork}
              handleEngage={props.handleEngage}
              mouseLeave={mouseLeave}
              activeTutorial={activeTutorial}
            />
          )}
        </div>
      </div>
    </>
  );
}
