/**
 *
 * Footer
 *
 */
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  const [hasGA, setHasGA] = useState(false);
  const commitHash = process.env.REACT_APP_GIT_COMMIT_ID || '';

  useEffect(() => {
    setHasGA(window.hasOwnProperty('ga') || window.hasOwnProperty('gtag'));
  }, []);

  return (
    <footer className="tw-mt-4">
      <div className="tw-container tw-py-4 tw-mx-auto tw-px-4">
        <div className="tw-flex tw-flex-col tw-justify-center tw-items-start tw-text-lightGrey">
          <h6 className="tw-font-normal tw-text-base tw-mb-6">
            <Trans
              i18nKey={translations.footer.title}
              components={[<strong></strong>]}
            />
          </h6>
          <div className="tw-font-light">
            <p className="tw-mb-4">
              <Trans i18nKey={translations.footer.notice_1} />
            </p>
            <p className="tw-mb-4">
              <Trans i18nKey={translations.footer.notice_2} />
            </p>
            <p className="tw-mb-4">
              <Trans
                i18nKey={translations.footer.notice_3}
                components={[
                  <a
                    href="https://wiki.sovryn.app/en/getting-started/faq-general"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    x
                  </a>,
                ]}
              />
            </p>
            <p className="tw-mb-4">
              <Trans
                i18nKey={translations.footer.notice_4}
                components={[
                  <a
                    href="https://wiki.sovryn.app/en/getting-started/wallet-setup"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="tw-font-light tw-text-gold"
                  >
                    x
                  </a>,
                ]}
              />
            </p>
          </div>
        </div>
        {hasGA && (
          <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-text-lightGrey tw-mb-6">
            <a
              title="GoogleAnalyticsOptout"
              target="_blank"
              rel="noopener noreferrer"
              href={
                navigator.userAgent.indexOf('Chrome/') > 0
                  ? 'https://chrome.google.com/webstore/detail/google-analytics-opt-out/fllaojicojecljbmefodhfapmkghcbnh?hl=en'
                  : 'https://tools.google.com/dlpage/gaoptout'
              }
            >
              <Trans
                i18nKey={translations.footer.optOut}
                components={[<strong></strong>]}
              />
            </a>
          </div>
        )}
        <div className="small tw-text-lightGrey tw-mb-3">
          Charts powered by{' '}
          <a
            href="https://www.highcharts.com"
            target="_blank"
            rel="noopener noreferrer"
            className="tw-font-normal tw-text-white"
          >
            Highcharts
          </a>
          . All rights reserved.
        </div>
        {commitHash && (
          <div className="small tw-text-white">
            {t(translations.footer.buildID)}:{' '}
            <a
              href={`https://github.com/DistributedCollective/Sovryn-frontend/commit/${commitHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tw-font-normal tw-text-white"
            >
              {commitHash.substr(0, 7)}
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
