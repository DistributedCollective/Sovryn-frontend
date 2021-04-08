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
  const [hasMatomo, setHasMatomo] = useState(false);
  const commitHash = process.env.REACT_APP_GIT_COMMIT_ID || '';

  useEffect(() => {
    setHasMatomo(window.hasOwnProperty('Matomo'));
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
        {hasMatomo && (
          <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-text-lightGrey tw-mt-12">
            <iframe
              title="MatomoOptout"
              style={{ width: '100%', border: 'none', marginLeft: '-5px' }}
              src="https://sovrynapp.matomo.cloud/index.php?module=CoreAdminHome&action=optOut&language=en&backgroundColor=171717&fontColor=ffffff&fontSize=14px&fontFamily=system-ui"
            />
          </div>
        )}
      </div>
    </footer>
  );
}
