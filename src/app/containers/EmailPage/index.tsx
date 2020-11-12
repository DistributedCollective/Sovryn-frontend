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
      title: 'Success!',
      subText:
        'You will now receive email notifications when your positions are close to liquidation, and if a position has been liquidated. You may opt out of these at any time',
    },
    UNSUBSCRIBE: {
      title: 'You are now unsubscribed from email notifications',
      subText:
        'You will no longer receive emails about margin calls or liquidated positions. You can re-subscribe to these notifications at any time.',
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
