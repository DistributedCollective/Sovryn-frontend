import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function Explainer() {
  const { t } = useTranslation();

  return (
    <>
      <div className="font-family-montserrat">
        <p className="text-white font-weight-bold mt-3">
          <u style={{ textUnderlinePosition: 'under' }}>
            {t(translations.marketingPage.explain.earn)}
          </u>
        </p>
        <p>
          {t(translations.marketingPage.explain.datesUSDT)}
          <br />
          {t(translations.marketingPage.explain.datesSOV)}
        </p>
        <p>
          {t(translations.marketingPage.explain.depositUSDT)}
          <br />
          {t(translations.marketingPage.explain.depositRBTC)}
          <br />
          {t(translations.marketingPage.explain.depositSOV)}
        </p>
        <div>
          {t(translations.marketingPage.explain.sharePool)}
          <div className="w-100 text-center text-white mt-2">
            {t(translations.marketingPage.explain.liquidityAdded)}
          </div>
          <Line />
          <div className="w-100 text-center text-white">
            {t(translations.marketingPage.explain.totalAdded)}
          </div>
        </div>
      </div>
    </>
  );
}

const Line = styled.div`
  background-color: white;
  width: 400px;
  height: 1px;
  margin: 0 auto;
`;
