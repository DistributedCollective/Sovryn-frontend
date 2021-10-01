/**
 *
 * ServiceWorkerToaster
 *
 */
import React, { useEffect, useState, useCallback } from 'react';
import * as serviceWorker from 'serviceWorker';
import { translations } from 'locales/i18n';
import { Trans, useTranslation } from 'react-i18next';
import { Dialog } from '@blueprintjs/core';
import styles from './index.module.scss';
import logoSvg from 'assets/images/sovryn-logo-horz-white.png';
import { Button } from '../Button';
import classNames from 'classnames';

//interval time to check sw
const CHECK_TIME = 30e3; // 30 seconds
const REOPEN_TIME = 120e3; // 120 seconds
const versionUrl = `${process.env.PUBLIC_URL}/version.json`;

export function ServiceWorkerToaster() {
  const [update, setUpdate] = useState(false);
  const [show, setShow] = useState<boolean>(false);
  const [swRegistration, setSwRegistration] = useState<
    ServiceWorkerRegistration
  >();
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [closeBtn, setCloseBtn] = useState(true);
  const [nextCommit, setNextCommit] = useState('');
  const { t } = useTranslation();

  const currentCommit = process.env.REACT_APP_GIT_COMMIT_ID || '';

  const fetchVersion = useCallback(async () => {
    return fetch(versionUrl, {
      headers: {
        'Service-Worker': 'script',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
      .then(async response => {
        const data = await response.json();
        if (!data) return;
        setNextCommit(data.commit || '');
      })
      .catch(() => {});
  }, [setNextCommit]);

  useEffect(() => {
    if (
      process.env.NODE_ENV === 'production' &&
      currentCommit &&
      nextCommit &&
      currentCommit !== nextCommit
    ) {
      if (swRegistration && swRegistration.update) {
        // Don't setShow(true) yet. Calling update triggers onUpdate below.
        swRegistration.update();
      } else {
        setShow(true);
      }
    }
    // eslint-disable-next-line
  }, [swRegistration, setShow, nextCommit]);

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
      setShow(true);
    }, REOPEN_TIME);
  };

  useEffect(() => {
    fetchVersion();
    serviceWorker.register({
      onUpdate: async registration => {
        setSwRegistration(registration);
        if (nextCommit === currentCommit) {
          await fetchVersion();
        }
        setShow(true);
      },
      onSuccess: registration => {
        setSwRegistration(registration);
      },
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const intId = setInterval(() => fetchVersion(), CHECK_TIME);
      setIntervalId(intId);
      return () => clearInterval(intId);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Dialog isOpen={show} className={styles.dialog}>
      <div className="tw-container tw-mx-auto tw-px-4 tw-text-center">
        <img
          className="tw-w-30 tw-mx-auto tw-mb-6"
          src={logoSvg}
          alt="Sovryn"
        />
        <p className="tw-text-sov-white tw-mb-6">
          <Trans
            i18nKey={translations.serviceWorkerToaster.title}
            components={[
              <strong></strong>,
              <a
                className="font-bold"
                href={`https://github.com/DistributedCollective/Sovryn-frontend/commit/${nextCommit}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                id
              </a>,
            ]}
            values={{ buildId: nextCommit.substr(0, 7) }}
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
              className={classNames(
                styles.close,
                'tw-text-primary tw-bg-transparent',
              )}
              text={t(translations.serviceWorkerToaster.closeBtn)}
              onClick={() => closeDialog()}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
}
