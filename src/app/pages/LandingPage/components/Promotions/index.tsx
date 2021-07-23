import React from 'react';
import { PromotionsCarousel } from './components/PromotionsCarousel/index';
import { AppSection } from './components/PromotionCard/types';
import { PromotionCard } from './components/PromotionCard';
import { Asset } from 'types';

export const Promotions: React.FC = () => (
  <div className="tw-my-20">
    <PromotionsCarousel>
      <PromotionCard
        appSection={AppSection.Lend}
        asset={Asset.DOC}
        title="35K SOV rewards"
        duration="13/04/21, 12.00 UTC - 11/05/21, 12.00 UTC"
        text="Provide a 1:1 ratio of SOV and BTC the SOV/BTC AMM liquidity pool and instantly start accruing your share of 40,000 SOV rewards."
      />

      <PromotionCard
        appSection={AppSection.YieldFarm}
        asset={Asset.DOC}
        title="25K SOV rewards"
        duration="13/04/21, 12.00 UTC - 11/05/21, 12.00 UTC"
        text="Provide a 1:1 ratio of SOV and BTC the SOV/BTC AMM liquidity pool and instantly start accruing your share of 40,000 SOV rewards."
      />

      <PromotionCard
        appSection={AppSection.Borrow}
        asset={Asset.SOV}
        title="40K SOV rewards"
        duration="13/04/21, 12.00 UTC - 11/05/21, 12.00 UTC"
        text="Provide a 1:1 ratio of SOV and BTC the SOV/BTC AMM liquidity pool and instantly start accruing your share of 40,000 SOV rewards."
      />

      <PromotionCard
        appSection={AppSection.MarginTrade}
        asset={Asset.RBTC}
        title="Over 1000% Yield for ETH/BTC LP's"
        duration="13/04/21, 12.00 UTC - 11/05/21, 12.00 UTC"
        text="Provide a 1:1 ratio of SOV and BTC the SOV/BTC AMM liquidity pool and instantly start accruing your share of 40,000 SOV rewards."
      />
    </PromotionsCarousel>
  </div>
);
