import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { discordInvite } from 'utils/classifiers';

import OptOutDialog from 'app/components/OptOutDialog';
import footerLogo from 'assets/images/footer-logo.svg';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const commitHash = process.env.REACT_APP_GIT_COMMIT_ID || '';
  const [optDialogOpen, setOptDialogOpen] = useState<boolean>(false);

  return (
    <footer className="tw-mt-4 tw-bg-gray-2 tw-text-sov-white tw-pt-5">
      <h6 className="tw-font-normal tw-text-base tw-text-center tw-w-full">
        <Trans
          i18nKey={translations.footer.title}
          components={[<strong></strong>]}
        />
      </h6>
      <div className="tw-flex tw-flex-col md:tw-flex-row tw-container tw-pb-10 tw-mx-auto tw-px-4 tw-mt-5">
        <div className="tw-flex-1">
          <div className="tw-flex tw-flex-col tw-justify-center tw-items-start tw-text-sov-white">
            <div className="tw-font-normal tw-text-xs">
              <p className="tw-mb-0">
                <Trans i18nKey={translations.footer.notice_1} />
              </p>
              <p className="tw-mb-2">
                <Trans i18nKey={translations.footer.notice_2} />
              </p>
              <p className="tw-mb-2">
                <Trans
                  i18nKey={translations.footer.notice_3}
                  components={[
                    <a
                      className="tw-text-secondary tw-underline"
                      href="https://wiki.sovryn.app/en/getting-started/faq-general"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      x
                    </a>,
                  ]}
                />
              </p>
              <p className="tw-mb-2">
                <Trans
                  i18nKey={translations.footer.notice_4}
                  components={[
                    <a
                      href="https://wiki.sovryn.app/en/getting-started/wallet-setup"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="tw-font-normal tw-text-secondary tw-underline"
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
                      className="tw-font-normal tw-text-secondary tw-underline"
                    >
                      x
                    </a>,
                  ]}
                />
              </p>
            </div>
          </div>
          <div className="tw-text-base">
            <div
              className="tw-cursor-pointer hover:tw-underline tw-font-base tw-text-primary tw-underline tw-mt-3 md:tw-mt-6 tw-mb-3 md:tw-mb-0"
              onClick={e => setOptDialogOpen(true)}
            >
              {t(translations.footer.optOut)}
            </div>
          </div>
        </div>
        <div className="tw-flex tw-flex-col tw-justify-end tw-relative">
          <img
            src={footerLogo}
            alt="Sovryn"
            className="tw-w-20 md:tw-w-40 tw-absolute tw--top-8 tw-right-0"
          />
          {commitHash && (
            <div className="tw-text-sov-white tw-w-full tw-text-right tw-mb-2">
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
          <div className="tw-text-tiny tw-text-sov-white tw-w-full tw-text-right">
            Charts powered by{' '}
            <a
              href="https://www.highcharts.com"
              target="_blank"
              rel="noopener noreferrer"
              className="tw-font-normal tw-text-sov-white"
            >
              Highcharts
            </a>
            . All rights reserved.
          </div>
        </div>
      </div>
      <OptOutDialog
        open={optDialogOpen}
        onClose={() => setOptDialogOpen(false)}
      />
    </footer>
  );
};
