/**
 *
 * SwapPage
 *
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Header } from '../../components/Header';
import { SwapFormContainer } from '../SwapFormContainer';
import { SwapHistory } from '../SwapHistory';

export function SwapPage() {
  const { t } = useTranslation();
  const [successfulTransactions, setSuccessfulTransactions] = useState(0);

  useEffect(() => {
    const bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.style.background = '#161616';
  }, []);

  return (
    <>
      <Helmet>
        <title>{t(translations.swap.title)}</title>
        <meta name="description" content={t(translations.swap.meta)} />
      </Helmet>
      <Header />
      <div className="container swap-page">
        <div className="row">
          <div className="col-12">
            <SwapFormContainer
              onSuccess={() =>
                setTimeout(
                  () => setSuccessfulTransactions(prevValue => prevValue + 1),
                  10000,
                )
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 swap-history-table-container">
            <SwapHistory successfulTransactions={successfulTransactions} />
          </div>
        </div>
      </div>
    </>
  );
}
