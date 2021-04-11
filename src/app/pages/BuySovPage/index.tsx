/**
 *
 * TradingPage
 *
 */

import React, { useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components/macro';

import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import PageHeader from '../../components/PageHeader';
import { ArrowStep } from './components/ArrowStep';
import { EngageWalletStep } from './components/EngageWallet';
import { TopUpWallet } from './components/TopUpWallet';
import { BuyForm } from './components/BuyForm';
import { Welcome } from './components/Welcome';
import { InfoBar } from './components/InfoBar';
import { Feature } from './components/Feature';

import imgPlaceholder from 'assets/placeholder.svg';
import imgMtFeature from 'assets/mt-feature.svg';

export function BuySovPage() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollTo = useCallback(() => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop,
        behavior: 'smooth',
      });
    }
  }, [ref]);
  return (
    <>
      <Helmet>
        {/*<title>{t(s.meta.title)}</title>*/}
        {/*<meta name="description" content={t(s.meta.description)} />*/}
      </Helmet>
      <Header />
      <div className="container mt-5 font-family-montserrat">
        <PageHeader content="Buy SOV exclusively on Sovryn!" />

        <InfoBar />

        <div className="w-100 d-flex flex-row justify-content-center align-items-start">
          <div>
            <div className="w-100 d-flex flex-row justify-content-center align-items-start">
              <EngageWalletStep />
              <ArrowStep />
              <TopUpWallet />
            </div>
            <Welcome />
          </div>
          <ArrowStep />
          <BuyForm />
        </div>

        <div className="w-100 text-center">
          <Learn onClick={scrollTo}>How to earn with SOV</Learn>

          <How ref={ref}>How you can use SOV</How>
        </div>

        <Feature
          title="Staking/Voting"
          content={
            <>
              Stake your SOV at Bitocracy.sovryn.app/stake and immediately start
              earning a percentage of trading fees generated on the platform.
              Staked SOV is also used for calculating voting power in Bitocracy.{' '}
              <a
                href="https://wiki.sovryn.app"
                target="_blank"
                rel="noreferrer noopener"
              >
                Learn more
              </a>
            </>
          }
          image={imgPlaceholder}
          cta="Stake"
          href="https://bitocracy.sovryn.app/stake"
        />

        <Feature
          title="Liquidity Mining"
          content={
            <>
              50,000 SOV tokens are up for grabs to users who deposit BTC and/or
              SOV to the BTC/SOV pool between 1st April and 30th April 2021.{' '}
              <a
                href="https://wiki.sovryn.app"
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
              Sovryn offers permissionless, noncustodial and
              censorship-resistant swaps and margin tradesutilising an
              oracle-based Dynamic Automated Market Maker.{' '}
              <a
                href="https://wiki.sovryn.app"
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
                href="https://wiki.sovryn.app"
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
          title="Market Making"
          content={
            <>
              Earn a passive income by lending your assets directly to borrowers
              or to margin traders.{' '}
              <a
                href="https://wiki.sovryn.app"
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
        />

        <Feature
          title="Lending"
          content={
            <>
              Earn a passive income by lending your assets directly to borrowers
              or to margin traders.{' '}
              <a
                href="https://wiki.sovryn.app"
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
          reverse
        />
      </div>
      <Footer />
    </>
  );
}

const Learn = styled.button`
  border: 1px solid #e9eae9;
  color: #e9eae9;
  padding: 11px 37px;
  margin: 70px auto 115px;
  display: inline-block;
  border-radius: 10px;
  background: transparent;
  text-transform: none;
`;
const How = styled.h1`
  font-size: 36px;
  letter-spacing: 4.3px;
  line-height: 47px;
  text-transform: none;
`;
