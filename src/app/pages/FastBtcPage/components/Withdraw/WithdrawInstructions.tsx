import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { CREATE_TICKET_LINK } from 'utils/classifiers';
import i18next from 'i18next';

export const WithdrawInstructions: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="tw-my-8 tw-px-8">
      <h4 className="tw-text-base tw-text-white tw-mb-3 tw-normal-case tw-font-semibold">
        {t(translations.fastBtcPage.withdraw.withdrawInstructions.title)}
      </h4>
      <ul className="tw-pl-4 tw-list-disc tw-text-sm">
        <li>
          {t(translations.fastBtcPage.withdraw.withdrawInstructions.line1)}
        </li>
        <li>
          {t(translations.fastBtcPage.withdraw.withdrawInstructions.line2)}
        </li>
        <li>
          {t(translations.fastBtcPage.withdraw.withdrawInstructions.line3)}
        </li>
        <li>
          {t(translations.fastBtcPage.withdraw.withdrawInstructions.line4, {
            hours: 1.5,
          })}
        </li>
        <li>
          <Trans
            i18nKey={
              translations.fastBtcPage.withdraw.withdrawInstructions.line5
            }
            tOptions={{ hours: 1.5 }}
            components={[
              <a
                href={CREATE_TICKET_LINK + i18next.language}
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
