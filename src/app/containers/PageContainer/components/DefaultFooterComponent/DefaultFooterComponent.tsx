import React from 'react';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { discordInvite } from 'utils/classifiers';
import footerLogo from 'assets/images/footer-logo.svg';
import hackenLogo from 'assets/images/Hacken.svg';

type FooterProps = {
  isPerpetuals?: boolean;
};

export const Footer: React.FC<FooterProps> = ({ isPerpetuals = false }) => {
  const { t } = useTranslation();
  const commitHash = process.env.REACT_APP_GIT_COMMIT_ID || '';

  return (
    <footer className="tw-mt-4 tw-bg-gray-2 tw-text-sov-white tw-pt-5">
      <div className="tw-flex tw-items-center tw-justify-center">
        <h6 className="tw-font-normal tw-text-base tw-text-center tw-mt-1">
          <Trans
            i18nKey={translations.footer.title}
            components={[<strong></strong>]}
          />
        </h6>
        {isPerpetuals ? (
          <img className="tw-ml-6" src={hackenLogo} alt="Hacken" />
        ) : (
          <></>
        )}
      </div>

      <div className="tw-flex tw-flex-col md:tw-flex-row tw-container tw-pb-10 tw-mx-auto tw-mt-5">
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
                      href="https://wiki.sovryn.app/en/getting-started/wallet-setup"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="tw-font-normal tw-text-secondary tw-underline"
                      data-action-id="footer-link-wiki"
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
                      href={discordInvite}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="tw-font-normal tw-text-secondary tw-underline"
                      data-action-id="footer-link-discord"
                    >
                      x
                    </a>,
                  ]}
                />
              </p>
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
    </footer>
  );
};
