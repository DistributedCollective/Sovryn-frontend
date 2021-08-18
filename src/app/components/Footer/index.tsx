/**
 *
 * Footer
 *
 */
import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import OptOutDialog from '../OptOutDialog';
import { discordInvite } from 'utils/classifiers';

export function Footer() {
  const { t } = useTranslation();
  const commitHash = process.env.REACT_APP_GIT_COMMIT_ID || '';
  const [optDialogOpen, setOptDialogOpen] = useState<boolean>(false);

  return (
    <footer className="tw-mt-4">
      <div className="tw-container tw-py-4 tw-mx-auto tw-px-4">
        <div className="tw-flex tw-flex-col tw-justify-center tw-items-start tw-text-gray-9">
          <h6 className="tw-font-normal tw-text-base tw-mb-6">
            <Trans
              i18nKey={translations.footer.title}
              components={[<strong></strong>]}
            />
          </h6>
          <div className="tw-font-light">
            <p className="tw-mb-1">
              <Trans i18nKey={translations.footer.notice_1} />
            </p>
            <p className="tw-mb-1">
              <Trans i18nKey={translations.footer.notice_2} />
            </p>
            <p className="tw-mb-1">
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
            <p className="tw-mb-1">
              <Trans
                i18nKey={translations.footer.notice_4}
                components={[
                  <a
                    href="https://wiki.sovryn.app/en/getting-started/wallet-setup"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="tw-font-light tw-text-primary"
                  >
                    x
                  </a>,
                ]}
              />
            </p>
            <p className="tw-mb-1">
              <Trans
                i18nKey={translations.footer.notice_5}
                components={[
                  <a
                    href={discordInvite}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="tw-font-light tw-text-primary"
                  >
                    x
                  </a>,
                ]}
              />
            </p>
          </div>
        </div>
        <div className="tw-mb-6 tw-text-xs">
          <div
            className="tw-cursor-pointer hover:tw-underline tw-font-light tw-text-primary"
            onClick={e => setOptDialogOpen(true)}
          >
            {t(translations.footer.optOut)}
          </div>
        </div>
        {commitHash && (
          <div className="tw-text-xs tw-text-sov-white">
            {t(translations.footer.buildID)}:{' '}
            <a
              href={`https://github.com/DistributedCollective/Sovryn-frontend/commit/${commitHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tw-font-normal tw-text-sov-white"
            >
              {commitHash.substr(0, 7)}
            </a>
          </div>
        )}
        <div className="tw-text-xs tw-text-gray-9 tw-mb-1">
          Charts powered by{' '}
          <a
            href="https://www.highcharts.com"
            target="_blank"
            rel="noopener noreferrer"
            className="tw-font-normal tw-text-gray-9"
          >
            Highcharts
          </a>
          . All rights reserved.
        </div>
      </div>
      <OptOutDialog
        open={optDialogOpen}
        onClose={() => setOptDialogOpen(false)}
      />
    </footer>
  );
}
