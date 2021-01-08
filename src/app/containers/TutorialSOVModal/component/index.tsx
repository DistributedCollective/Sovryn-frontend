import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Screen4 } from './screen4';
import { Icon } from '@blueprintjs/core';

export function TutorialDialogComponent(props) {
  const { t } = useTranslation();
  return (
    <>
      <div className="sov-tutorial_container position-fixed mx-auto">
        <div className={'position-absolute'}>
          <div className="close" onClick={props.handleClose}>
            <Icon icon="cross" iconSize={35} color="white" />
          </div>
          <div className="title">
            {t(translations.SOVConnectTutorial.screens[4].title)}
          </div>
          <Screen4 handleClick={props.handleClose} />
        </div>
      </div>
    </>
  );
}
