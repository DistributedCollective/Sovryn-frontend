import React, { useState } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useTranslation } from 'react-i18next';
import background from 'assets/images/tutorial/test.svg';
import close from 'assets/images/tutorial/close.svg';
import { translations } from 'locales/i18n';
import { Screen1 } from './screen1';
import { Screen2 } from './screen2';
import { Screen3 } from './screen3';
import { Screen4 } from './screen4';

export function TutorialDialogComponent(props) {
  const { t } = useTranslation();
  const [mouseLeave, setMouseLeave] = useState(false);
  const activeTutorial =
    reactLocalStorage.get('tutorial_active') === 'true' &&
    props.onNetwork === true
      ? true
      : false;
  const [screen, setScreen] = useState(activeTutorial ? 2 : 1);

  function changeScreen(num) {
    setScreen(num);
  }

  function back() {
    screen === 3 ? setScreen(4) : setScreen(1);
  }

  return (
    <>
      <div
        className="wallet-tutorial_container position-absolute mx-auto"
        onMouseLeave={() => {
          console.log('Mouse out');
          if (screen === 2) {
            setMouseLeave(true);
          } else {
            setMouseLeave(false);
          }
        }}
      >
        <div className={`${screen === 2 && 'left'} position-absolute`}>
          <div className="background position-relative w-100">
            <img src={background} alt="" className="w-100 h-100" />
          </div>
          <div className="close" onClick={props.handleClose}>
            <img src={close} alt="close" />
          </div>
          {screen !== 1 && (
            <div className="back position-absolute" onClick={() => back()}>
              <button>{t(translations.common.back)}</button>
            </div>
          )}
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
          {/* <Screen3 /> */}
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
          {screen === 3 && <Screen3 />}
          {screen === 4 && <Screen4 handleClick={changeScreen} />}
        </div>
      </div>
    </>
  );
}
