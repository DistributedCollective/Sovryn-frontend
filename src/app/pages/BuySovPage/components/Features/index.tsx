import React from 'react';
import styled from 'styled-components/macro';
import { Feature } from '../Feature';
import imgPlaceholder from '../../../../../assets/placeholder.svg';
import imgMtFeature from '../../../../../assets/mt-feature.svg';
import { StakeVote } from './StakeVote';

export function Features() {
  return (
    <>
      <div className="w-100 text-center">
        <How>Sovryn protocol features</How>
      </div>

      <Feature
        title="Liquidity Mining"
        content={
          <>
            50,000 SOV tokens are up for grabs to users who deposit BTC and/or
            SOV to the BTC/SOV pool between 1st April and 30th April 2021.{' '}
            <a
              href="https://wiki.sovryn.app/en/technical-documents/amm/AMM-FAQ"
              target="_blank"
              rel="noreferrer noopener"
            >
              Learn more
            </a>
          </>
        }
        image={imgPlaceholder}
        cta="Mine"
        href="/liquidity"
        reverse
      />

      <Feature
        title="Margin Trading"
        content={
          <>
            Sovryn offers permissionless, noncustodial and censorship-resistant
            swaps and margin tradesutilising an oracle-based Dynamic Automated
            Market Maker.{' '}
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/trading#margin-trading-on-sovryn"
              target="_blank"
              rel="noreferrer noopener"
            >
              Learn more
            </a>
          </>
        }
        image={imgMtFeature}
        cta="Trade"
        href="/trade"
      />

      <Feature
        title="Swap"
        content={
          <>
            Earn a passive income by lending your assets directly to borrowers
            or to margin traders.{' '}
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/trading#step-1-go-to-the-sovryn-dapp"
              target="_blank"
              rel="noreferrer noopener"
            >
              Learn more
            </a>
          </>
        }
        image={imgPlaceholder}
        cta="Swap"
        href="/trade?swap"
        reverse
      />

      <Feature
        title="Lending"
        content={
          <>
            Earn a passive income by lending your assets directly to borrowers
            or to margin traders.{' '}
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/lending"
              target="_blank"
              rel="noreferrer noopener"
            >
              Learn more
            </a>
          </>
        }
        image={imgPlaceholder}
        cta="Trade"
        href="/loans"
      />

      <Feature
        title="Market Making"
        content={
          <>
            Earn a passive income by lending your assets directly to borrowers
            or to margin traders.{' '}
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/market-making#video-how-to-earn-by-market-making"
              target="_blank"
              rel="noreferrer noopener"
            >
              Learn more
            </a>
          </>
        }
        image={imgPlaceholder}
        cta="Market Maker"
        href="/liquidity"
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
