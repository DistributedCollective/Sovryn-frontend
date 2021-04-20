/**
 *
 * ServiceWorkerToaster
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
import * as serviceWorker from 'serviceWorker';
import { translations } from 'locales/i18n';
import { Trans, useTranslation } from 'react-i18next';
import { Dialog } from '@blueprintjs/core';
import styled from 'styled-components/macro';
import styles from './index.module.css';
import logoSvg from 'assets/images/sovryn-logo-horz-white.png';
import { Button } from '../Button';
import axios from 'axios';
import { soliditySha3 } from 'web3-utils';

interface Props {}

//interval time to check sw
const CHECK_TIME = 10 * 60 * 1000;
const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

export function ServiceWorkerToaster(props: Props) {
  const [show, setShow] = useState<boolean>(false);
  const [swRegistration, setSwRegistration] = useState<
    ServiceWorkerRegistration
  >();
  const [newSW, setNewSW] = useState('');
  const [oldSW, setOldSW] = useState('');
  const { t } = useTranslation();
  const commitHash = process.env.REACT_APP_GIT_COMMIT_ID || '';

  const fetchSw = useCallback(first => {
    axios
      .get(swUrl, {
        headers: { 'Service-Worker': 'script' },
      })
      .then(({ data }) => {
        if (!data) return;
        const hash = soliditySha3(data);
        if (first) setOldSW(hash || '');
        else setNewSW(hash || '');
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!oldSW && newSW) setOldSW(newSW);
    if (oldSW && newSW && oldSW !== newSW) setShow(true);

    // eslint-disable-next-line
  }, [oldSW, newSW]);

  const updateSW = () => {
    if (swRegistration) {
      const waitingWorker = swRegistration && swRegistration.waiting;
      waitingWorker && waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      serviceWorker.unregister();
    }
    window.location.reload();
  };

  useEffect(() => {
    fetchSw(true);
    serviceWorker.register({
      onUpdate: registration => {
        setSwRegistration(registration);
        setShow(true);
      },
    });
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const intId = setInterval(() => fetchSw(false), CHECK_TIME);
    return () => clearInterval(intId);
    // eslint-disable-next-line
  }, []);

  return (
    <Dialog isOpen={show} className={styles.dialog}>
      <div className="tw-container tw-mx-auto tw-px-4 text-center">
        <StyledLogo className="mx-auto tw-mb-6" src={logoSvg} />
        <p className="tw-text-white tw-mb-6">
          <Trans
            i18nKey={translations.serviceWorkerToaster.title}
            components={[<strong></strong>]}
            values={{ buildId: commitHash.substr(0, 7) }}
          />
        </p>
        <p className="tw-mb-6">{t(translations.serviceWorkerToaster.notice)}</p>
        <div className="tw-flex tw-flex-col tw-items-center">
          <Button
            className="tw-mb-3"
            text={t(translations.serviceWorkerToaster.updateBtn)}
            onClick={() => updateSW()}
          />
          <Button
            className={styles.close + ' text-gold bg-transparent'}
            text={t(translations.serviceWorkerToaster.closeBtn)}
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
