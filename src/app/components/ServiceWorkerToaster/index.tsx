/**
 *
 * ServiceWorkerToaster
 *
 */
import React, { useEffect, useState } from 'react';
import * as serviceWorker from 'serviceWorker';
import { translations } from 'locales/i18n';
import { Trans, useTranslation } from 'react-i18next';
import { Dialog } from '@blueprintjs/core';
import styled from 'styled-components/macro';
import styles from './index.module.css';
import logoSvg from 'assets/images/sovryn-logo-horz-white.png';
import { Button } from '../Button';
import axios from 'axios';

interface Props {}

//interval time to check sw
const CHECK_TIME = 60e3; // 15 seconds
const REOPEN_TIME = 120e3; // 120 seconds
const swUrl = `${process.env.PUBLIC_URL}/version.json`;

export function ServiceWorkerToaster(props: Props) {
  const [update, setUpdate] = useState(false);
  const [show, setShow] = useState<boolean>(false);
  const [swRegistration, setSwRegistration] = useState<
    ServiceWorkerRegistration
  >();
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [closeBtn, setCloseBtn] = useState(true);
  const [newSW, setNewSW] = useState('');
  const [oldSW, setOldSW] = useState('');
  const { t } = useTranslation();

  const commitHash = process.env.REACT_APP_GIT_COMMIT_ID || '';

  let cancelTokenSource;
  const fetchSw = first => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel();
    }
    cancelTokenSource = axios.CancelToken.source();

    // TODO: change with native fetch
    axios
      .get(swUrl, {
        headers: {
          'Service-Worker': 'script',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
        cancelToken: cancelTokenSource.token,
      })
      .then(({ data }) => {
        if (!data) return;
        console.log(data);
        const hash = data.commit;
        if (first) setOldSW(hash || '');
        else setNewSW(hash || '');
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!oldSW && newSW) setOldSW(newSW);
    if (oldSW && newSW && oldSW !== newSW) {
      console.log('SWT: version missmatch');
      if (swRegistration && swRegistration.update) {
        console.log('SWT: SW.update called');
        swRegistration.update();
        //Don't setShow(true) yet. Calling update triggers onUpdate below.
      } else {
        setShow(true);
      }
    }
    // eslint-disable-next-line
  }, [oldSW, newSW]);

  const updateSW = () => {
    setUpdate(true);
    if (swRegistration) {
      const waitingWorker = swRegistration && swRegistration.waiting;
      waitingWorker && waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      serviceWorker.unregister();
    }
    fetch(`/clear-site-data`).finally(() =>
      window.location.replace(window.location.href),
    );
  };

  const closeDialog = () => {
    setShow(false);
    setCloseBtn(false);
    if (intervalId) clearInterval(intervalId);
    setTimeout(() => {
      console.log('SWT: reshow');
      setShow(true);
    }, REOPEN_TIME);
  };

  useEffect(() => {
    fetchSw(true);
    serviceWorker.register({
      onUpdate: registration => {
        setSwRegistration(registration);
        console.log('SWT: SW self update');
        setShow(true);
      },
      onSuccess: registration => {
        setSwRegistration(registration);
        console.log('SWT: SW ready');
      },
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const intId = setInterval(() => fetchSw(false), CHECK_TIME);
    setIntervalId(intId);
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
            loading={update}
            disabled={update}
            onClick={() => updateSW()}
          />
          {closeBtn && (
            <Button
              className={styles.close + ' text-gold bg-transparent'}
              text={t(translations.serviceWorkerToaster.closeBtn)}
              onClick={() => closeDialog()}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
}

const StyledLogo = styled.img.attrs(_ => ({
  alt: 'Sovryn',
}))`
  width: 120px;
`;
