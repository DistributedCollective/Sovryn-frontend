import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';

const s = translations.tradingPage;

interface EmailPageProps {
  type: 'OPTIN' | 'UNSUBSCRIBE';
}

export const EmailPage: React.FC<EmailPageProps> = props => {
  const { t } = useTranslation();

  const text = {
    OPTIN: {
      title: t(s.email.optin.title),
      subText: t(s.email.optin.text),
    },
    UNSUBSCRIBE: {
      title: t(s.email.unsubscribe.title),
      subText: t(s.email.unsubscribe.text),
    },
  };

  return (
    <>
      <Helmet>
        <title>{t(s.meta.title)}</title>
        <meta name="description" content={t(s.meta.description)} />
      </Helmet>
      <div className="tw-container tw-mx-auto tw-px-4 tw-my-12 tw-py-12">
        <h1 className="tw-mb-4">{text[props.type].title}</h1>
        <p>{text[props.type].subText}</p>
      </div>
    </>
  );
};
