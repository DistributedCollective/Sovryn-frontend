/**
 *
 * EmailOptInSuccessPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';

import { Header } from 'app/components/Header';
import { Footer } from '../../components/Footer';

const s = translations.tradingPage;

interface Props {
  type: 'OPTIN' | 'UNSUBSCRIBE';
}

export function EmailPage(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      <Header />
      <div className="container my-5 py-5">
        <h1 className="mb-3">{text[props.type].title}</h1>
        <p>{text[props.type].subText}</p>
      </div>
      <Footer />
    </>
  );
}
