import React, { useEffect, useState } from 'react';
import { Dialog } from '@blueprintjs/core';
import { translations } from 'locales/i18n';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import styles from './index.module.css';
import logoSvg from 'assets/images/sovryn-logo-horz-white.png';
import { Button } from '../Button';
import * as serviceWorker from 'serviceWorker';

const CHECK_TIME = 10000;

export function UpdateDaapDialog() {
  const [show, setShow] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const intId = setInterval(() => {
      console.log('serviceWorker register');
      serviceWorker.register({
        onUpdate: () => setShow(true),
      });
    }, CHECK_TIME);
    return () => clearInterval(intId);
    // eslint-disable-next-line
  }, []);

  return (
    <Dialog isOpen={show} className={styles.dialog}>
      <div className="tw-container tw-mx-auto tw-px-4 text-center">
        <StyledLogo className="mx-auto tw-mb-6" src={logoSvg} />
        <p className="tw-text-white tw-mb-6">
          <Trans
            i18nKey={translations.updateDaapDialog.title}
            components={[<strong></strong>]}
            values={{ buildId: 'test' }}
          />
        </p>
        <p className="tw-mb-6">{t(translations.updateDaapDialog.notice)}</p>
        <div className="tw-flex tw-flex-col tw-items-center">
          <Button
            className="tw-mb-3"
            text={t(translations.updateDaapDialog.updateBtn)}
            onClick={() => window.location.reload()}
          />
          <Button
            className={styles.close + ' text-gold bg-transparent'}
            text={t(translations.updateDaapDialog.closeBtn)}
            onClick={() => setShow(false)}
          />
        </div>
      </div>
    </Dialog>
  );
}

const StyledLogo = styled.img.attrs(_ => ({
  alt: 'logo',
}))`
  width: 120px;
`;
