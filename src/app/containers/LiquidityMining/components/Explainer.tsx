import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function Explainer() {
  const { t } = useTranslation();

  return (
    <>
      <p className="tw-text-white tw-font-bold tw-mt-5">
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
        <div className="tw-w-full tw-text-center tw-text-white tw-mt-5">
          {t(translations.marketingPage.explain.liquidityAdded)}
        </div>
        <Line />
        <div className="tw-w-full tw-text-center tw-text-white">
          {t(translations.marketingPage.explain.totalAdded)}
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
