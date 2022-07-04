import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { CREATE_TICKET_LINK } from 'utils/classifiers';

export const DepositInstructions: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="tw-my-8 tw-px-8">
      <h4 className="tw-text-base tw-text-white tw-mb-3 tw-normal-case tw-font-semibold">
        {t(translations.fastBtcPage.deposit.depositInstructions.title)}
      </h4>
      <ul className="tw-pl-4 tw-list-disc tw-text-sm">
        <li>{t(translations.fastBtcPage.deposit.depositInstructions.line1)}</li>
        <li>{t(translations.fastBtcPage.deposit.depositInstructions.line2)}</li>
        <li>{t(translations.fastBtcPage.deposit.depositInstructions.line3)}</li>
        <li>
          {t(translations.fastBtcPage.deposit.depositInstructions.line4, {
            hours: 1.5,
          })}
        </li>
        <li>
          <Trans
            i18nKey={translations.fastBtcPage.deposit.depositInstructions.line5}
            tOptions={{ hours: 1.5 }}
            components={[
              <a
                href={CREATE_TICKET_LINK}
                target="_blank"
                rel="noreferrer noopener"
              >
                ticket
              </a>,
            ]}
          />
        </li>
        <li>
          <Trans
            i18nKey={translations.fastBtcPage.deposit.depositInstructions.line6}
            tOptions={{ hours: 1.5 }}
            components={[
              <a
                href={CREATE_TICKET_LINK}
                target="_blank"
                rel="noreferrer noopener"
              >
                ticket
              </a>,
            ]}
          />
        </li>
      </ul>
    </section>
  );
};
