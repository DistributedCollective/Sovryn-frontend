/**
 *
 * ServiceWorkerToaster
 *
 */
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { bottomRightToaster } from 'utils/toaster';
import * as serviceWorker from 'serviceWorker';
import { translations } from 'locales/i18n';

interface Props {}

export function ServiceWorkerToaster(props: Props) {
  const { t } = useTranslation();

  const onUpdateNotification = useCallback(
    registration => {
      const waitingWorker = registration && registration.waiting;
      bottomRightToaster.show(
        {
          intent: 'primary',
          message: (
            <>
              <p className="mb-0">
                <strong>{t(translations.serviceWorkerToaster.title)}</strong>
              </p>
              <p className="mb-0">
                {t(translations.serviceWorkerToaster.message)}
              </p>
            </>
          ),
          action: {
            onClick: () => {
              waitingWorker &&
                waitingWorker.postMessage({ type: 'SKIP_WAITING' });

              fetch(`/clear-site-data`).finally(() =>
                window.location.replace(window.location.href),
              );
            },
            text: t(translations.serviceWorkerToaster.button),
          },
          timeout: 0,
        },
        'app-updated',
      );
    },
    [t],
  );

  useEffect(() => {
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.register({
      onUpdate: registration => onUpdateNotification(registration),
    });
    // eslint-disable-next-line
  }, []);

  return <></>;
}
