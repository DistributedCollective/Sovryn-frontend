/**
 *
 * TradingPage
 *
 */

import React, { useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { Footer } from 'app/components/Footer';
import { Header } from 'app/components/Header';

import { translations } from '../../../locales/i18n';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t(translations.buySovPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.buySovPage.meta.description)}
        />
      </Helmet>
      <Header />
      <div className="container mt-5 font-family-montserrat"></div>
      <Footer />
    </>
  );
}

const Rotated = styled.div`
  img {
    transform: rotate(90deg);
  }
`;
const RotatedMob = styled.div`
  @media (max-width: 768px) {
    img {
      transform: rotate(90deg);
    }
  }
`;
