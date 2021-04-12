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
    setHasGA(window.hasOwnProperty('ga'));
  }, []);

  return (
    <footer className="mt-3">
      <div className="container py-3">
        <div className="d-flex flex-column justify-content-center align-items-start text-lightGrey font-family-montserrat">
          <h6 className="font-weight-normal mb-4">
            <Trans
              i18nKey={translations.footer.title}
              components={[<strong></strong>]}
            />
          </h6>
          <div className="font-weight-light">
            <p>
              <Trans i18nKey={translations.footer.notice_1} />
            </p>
            <p>
              <Trans i18nKey={translations.footer.notice_2} />
            </p>
            <p>
              <Trans
                i18nKey={translations.footer.notice_3}
                components={[
                  <a
                    href="https://wiki.sovryn.app/en/getting-started/faq-general"
                    className="font-weight-light text-gold"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    x
                  </a>,
                ]}
              />
            </p>
            <p>
              <Trans
                i18nKey={translations.footer.notice_4}
                components={[
                  <a
                    href="https://wiki.sovryn.app/en/getting-started/wallet-setup"
                    className="font-weight-light text-gold"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    x
                  </a>,
                ]}
              />
            </p>
          </div>
        </div>
        {commitHash && (
          <div className="small text-white font-family-montserrat">
            {t(translations.footer.buildID)}:{' '}
            <a
              href={`https://github.com/DistributedCollective/Sovryn-frontend/commit/${commitHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-weight-normal"
            >
              {commitHash.substr(0, 7)}
            </a>
          </div>
        )}
        {hasGA && (
          <div className="d-flex flex-row justify-content-between align-items-center text-lightGrey mt-5">
            <iframe
              title="GoogleAnalyticsOptout"
              style={{ width: '100%', border: 'none', marginLeft: '-5px' }}
              src="https://chrome.google.com/webstore/detail/google-analytics-opt-out/fllaojicojecljbmefodhfapmkghcbnh?hl=en"
            />
          </div>
        )}
      </div>
    </footer>
  );
}
