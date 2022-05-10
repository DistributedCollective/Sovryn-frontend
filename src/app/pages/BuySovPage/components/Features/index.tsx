import React from 'react';
import styled from 'styled-components/macro';
import { Feature } from '../Feature';
import imgMining from 'assets/sov/liquidity-mining.svg';
import imgTrading from 'assets/sov/margin-trading.svg';
import imgSwap from 'assets/sov/swap.svg';
import imgMarketMaking from 'assets/sov/market-making.svg';
import imgLending from 'assets/sov/lending.svg';
import { StakeVote } from './StakeVote';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';

export function Features() {
  const { t } = useTranslation();
  return (
    <>
      <div className="tw-w-full tw-text-center">
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
              data-action-id="buySov-link-liquiditymining-learnmore"
            >
              {t(translations.buySovPage.features.learnMore)}
            </a>
          </>
        }
        image={imgMining}
        cta={t(translations.buySovPage.features.mining.cta)}
        href="/yield-farm"
        reverse
        ctaDataActionId="buySov-ctaButton-liquiditymining"
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
              data-action-id="buySov-link-margintrade-learnmore"
            >
              {t(translations.buySovPage.features.learnMore)}
            </a>
          </>
        }
        image={imgTrading}
        cta={t(translations.buySovPage.features.marginTrading.cta)}
        href="/trade"
        ctaDataActionId="buySov-ctaButton-margintrade"
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
              data-action-id="buySov-link-swap-learnmore"
            >
              {t(translations.buySovPage.features.learnMore)}
            </a>
          </>
        }
        image={imgSwap}
        cta={t(translations.buySovPage.features.swap.cta)}
        href="/swap"
        reverse
        ctaDataActionId="buySov-ctaButton-swap"
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
              data-action-id="buySov-link-yieldfarm-learnmore"
            >
              {t(translations.buySovPage.features.learnMore)}
            </a>
          </>
        }
        image={imgMarketMaking}
        cta={t(translations.buySovPage.features.liquidity.cta)}
        href="/yield-farm"
        ctaDataActionId="buySov-ctaButton-yieldfarm"
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
              data-action-id="buySov-link-lend-learnmore"
            >
              {t(translations.buySovPage.features.learnMore)}
            </a>
          </>
        }
        image={imgLending}
        cta={t(translations.buySovPage.features.lending.cta)}
        href="/lend"
        reverse
        ctaDataActionId="buySov-ctaButton-lend"
      />
      <StakeVote />
    </>
  );
}

const How = styled.h2`
  font-size: 2.5rem;
  line-height: 1.25;
  text-transform: none;
`;
