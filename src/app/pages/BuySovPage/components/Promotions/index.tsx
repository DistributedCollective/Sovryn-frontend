import React from 'react';
import styled from 'styled-components/macro';
import imgPromotion1 from 'assets/sov/promotion-1.svg';
import imgPromotion2 from 'assets/sov/promotion-2.svg';
import { Promotion } from './promotion';

export function Promotions() {
  return (
    <article className="container">
      <H1 className="text-center">SOV Promotions</H1>

      <Promotion
        title="April  50k SOV BTC/USDT Pool Loot Drop"
        content={
          <>
            Become a revered and respected Sovryn Liquidity Provider by adding
            your crypto to the pool. The longer you keep funds in the pool the
            more SOV you will earn.
          </>
        }
        cta="Sovryn goes brrrrrrrrrrrrrrr"
        href="https://sovryn.app/blog/sovryn-go-brrrrrr.html"
        image={imgPromotion1}
      />

      <Promotion
        title="April  75k SOV BTC/SOV Pool Loot Drop"
        content={
          <>
            The SOV/BTC liquidity pool is open, giving you the chance to take
            part in our biggest Liquidity Provision giveaway yet.
          </>
        }
        cta="Here’s how you get in"
        href="https://twitter.com/SovrynBTC/status/1381112432945459201"
        image={imgPromotion2}
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
