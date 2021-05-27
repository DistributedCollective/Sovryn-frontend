import React from 'react';
import styled from 'styled-components/macro';
// import imgPromotion1 from 'assets/sov/promotion-1.svg';
// import imgPromotion2 from 'assets/sov/promotion-2.svg';
import imgPromotion3 from 'assets/sov/promotion-3.svg';
import imgPromotion4 from 'assets/sov/promotion-4.svg';
import { Promotion } from './promotion';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';

export function Promotions() {
  const { t } = useTranslation();
  return (
    <article className="container">
      <H1 className="text-center">
        {t(translations.buySovPage.promotions.title)}
      </H1>

      {/* <Promotion
        title={t(translations.buySovPage.promotions.p1.title)}
        content={<>{t(translations.buySovPage.promotions.p1.text)}</>}
        cta={t(translations.buySovPage.promotions.p1.cta)}
        href="https://sovryn.app/blog/sovryn-go-brrrrrr.html"
        image={imgPromotion2}
      />

      <Promotion
        title={t(translations.buySovPage.promotions.p2.title)}
        content={<>{t(translations.buySovPage.promotions.p2.text)}</>}
        cta={t(translations.buySovPage.promotions.p2.cta)}
        href="https://twitter.com/SovrynBTC/status/1381112432945459201"
        image={imgPromotion1}
      /> */}

      <Promotion
        title={t(translations.buySovPage.promotions.p3.title)}
        content={<>{t(translations.buySovPage.promotions.p3.text)}</>}
        cta={t(translations.buySovPage.promotions.p3.cta)}
        href="/liquidity"
        image={imgPromotion3}
      />

      <Promotion
        title={t(translations.buySovPage.promotions.p4.title)}
        content={<>{t(translations.buySovPage.promotions.p4.text)}</>}
        cta={t(translations.buySovPage.promotions.p4.cta)}
        href="/liquidity"
        image={imgPromotion4}
      />
    </article>
  );
}

const H1 = styled.h1`
  margin-bottom: 20px;
  font-size: 36px;
  font-weight: 700;
  text-transform: none;
`;
