import React, { useEffect, useState, useCallback } from 'react';
import { Dialog } from '@blueprintjs/core';
import { translations } from 'locales/i18n';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import styles from './index.module.css';
import logoSvg from 'assets/images/sovryn-logo-horz-white.png';
import { Button } from '../Button';
import axios from 'axios';
import * as serviceWorker from 'serviceWorker';
import { sha256 } from 'utils/helpers';

//interval time to check sw
const CHECK_TIME = 10 * 60 * 1000;
const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

export function UpdateDaapDialog() {
  const [show, setShow] = useState<boolean>(false);
  const [newSW, setNewSW] = useState('');
  const [oldSW, setOldSW] = useState('');
  const { t } = useTranslation();

  const fetchSw = useCallback(first => {
    axios
      .get(swUrl, {
        headers: { 'Service-Worker': 'script' },
      })
      .then(async ({ data }) => {
        if (!data) return;
        const hash = await sha256(data);
        if (first) setOldSW(hash);
        else setNewSW(hash);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!oldSW && newSW) setOldSW(newSW);
    if (oldSW && newSW && oldSW !== newSW) setShow(true);

    // eslint-disable-next-line
  }, [oldSW, newSW]);

  useEffect(() => {
    fetchSw(true);
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const intId = setInterval(() => fetchSw(false), CHECK_TIME);
    return () => clearInterval(intId);
    // eslint-disable-next-line
  }, []);

  const updateSW = () => {
    serviceWorker.unregister();
    window.location.reload();
  };

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
            onClick={() => updateSW()}
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
