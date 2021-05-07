/**
 *
 * SwapPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Header } from '../../components/Header';
import { SwapFormContainer } from '../SwapFormContainer';
import { SwapHistory } from '../SwapHistory';

interface Props {}

export function SwapPage(props: Props) {
  const { t } = useTranslation();

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
            <SwapFormContainer />
          </div>
        </div>
        <div className="row">
          <div className="col-12 swap-history-table-container">
            <SwapHistory />
          </div>
        </div>
      </div>
    </>
  );
}
