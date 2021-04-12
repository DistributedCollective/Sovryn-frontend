import React from 'react';
import styled from 'styled-components/macro';
import { Feature } from '../Feature';
import imgPlaceholder from '../../../../../assets/placeholder.svg';
import imgMtFeature from '../../../../../assets/mt-feature.svg';
import { StakeVote } from './StakeVote';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';

export function Features() {
  const { t } = useTranslation();
  return (
    <>
      <div className="w-100 text-center">
        <How>{t(translations.buySovPage.features.title)}</How>
      </div>

      <Feature
        title={t(translations.buySovPage.features.mining.title)}
        content={
          <>
            {t(translations.buySovPage.features.mining.text)}{' '}
            <a
              href="https://wiki.sovryn.app/en/technical-documents/amm/AMM-FAQ"
              target="_blank"
              rel="noreferrer noopener"
            >
              {t(translations.buySovPage.features.learnMore)}
            </a>
          </>
        }
        image={imgPlaceholder}
        cta={t(translations.buySovPage.features.mining.cta)}
        href="/liquidity"
        reverse
      />

      <Feature
        title={t(translations.buySovPage.features.marginTrading.title)}
        content={
          <>
            {t(translations.buySovPage.features.marginTrading.text)}{' '}
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/trading#margin-trading-on-sovryn"
              target="_blank"
              rel="noreferrer noopener"
            >
              {t(translations.buySovPage.features.learnMore)}
            </a>
          </>
        }
        image={imgMtFeature}
        cta={t(translations.buySovPage.features.marginTrading.cta)}
        href="/trade"
      />

      <Feature
        title={t(translations.buySovPage.features.swap.title)}
        content={
          <>
            {t(translations.buySovPage.features.swap.text)}{' '}
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/trading#step-1-go-to-the-sovryn-dapp"
              target="_blank"
              rel="noreferrer noopener"
            >
              {t(translations.buySovPage.features.learnMore)}
            </a>
          </>
        }
        image={imgPlaceholder}
        cta={t(translations.buySovPage.features.swap.cta)}
        href="/trade?swap"
        reverse
      />

      <Feature
        title={t(translations.buySovPage.features.liquidity.title)}
        content={
          <>
            {t(translations.buySovPage.features.liquidity.text)}{' '}
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/market-making#video-how-to-earn-by-market-making"
              target="_blank"
              rel="noreferrer noopener"
            >
              {t(translations.buySovPage.features.learnMore)}
            </a>
          </>
        }
        image={imgPlaceholder}
        cta={t(translations.buySovPage.features.liquidity.cta)}
        href="/liquidity"
      />

      <Feature
        title={t(translations.buySovPage.features.lending.title)}
        content={
          <>
            {t(translations.buySovPage.features.lending.text)}{' '}
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/lending"
              target="_blank"
              rel="noreferrer noopener"
            >
              {t(translations.buySovPage.features.learnMore)}
            </a>
          </>
        }
        image={imgPlaceholder}
        cta={t(translations.buySovPage.features.lending.cta)}
        href="/loans"
        reverse
      />
      <StakeVote />
    </>
  );
}

const How = styled.h1`
  font-size: 36px;
  letter-spacing: 4.3px;
  line-height: 47px;
  text-transform: none;
`;
