import React from 'react';
import { PromotionsCarousel } from './components/PromotionsCarousel/index';
import { AppSection, PromotionColor } from './components/PromotionCard/types';
import { PromotionCard } from './components/PromotionCard';
import { Asset } from 'types';
import { Title } from './styled';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export const Promotions: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="tw-my-14 tw-border-b tw-border-solid tw-border-sov-white">
      <Title>{t(translations.landingPage.promotions.title)}</Title>

      <div className="tw-relative tw-mb-8">
        <PromotionsCarousel>
          <PromotionCard
            appSection={AppSection.Lend}
            backgroundColor={PromotionColor.Yellow}
            title="15K SOV rewards"
            duration="Ongoing weekly rewards"
            text="Provide any amount of XUSD to the XUSD lending pool and instantly start accruing your share of 15,000 SOV rewards."
            linkAsset={Asset.XUSD}
            learnMoreLink="https://www.sovryn.app/blog/sov-is-diving-into-the-lending-pools"
            logoAsset1={Asset.XUSD}
          />

          <PromotionCard
            appSection={AppSection.YieldFarm}
            backgroundColor={PromotionColor.Blue}
            title="15K SOV rewards"
            duration="Ongoing weekly rewards"
            text="Provide a 1:1 ratio of BNB and rBTC to the BNB/BTC AMM liquidity pool and instantly start accruing your share of 15,000 SOV rewards. Learn more"
            learnMoreLink="https://www.sovryn.app/blog/bnb-btc-pool-is-live"
            logoAsset1={Asset.BNB}
            logoAsset2={Asset.RBTC}
          />

          <PromotionCard
            appSection={AppSection.YieldFarm}
            backgroundColor={PromotionColor.Yellow}
            title="15K SOV rewards"
            duration="Ongoing weekly rewards"
            text="Provide a 1:1 ratio of XUSD and rBTC to the XUSD/rBTC AMM liquidity pool and instantly start accruing your share of 15,000 SOV rewards."
            learnMoreLink="https://www.sovryn.app/blog/xusd-go-brrrrr"
            logoAsset1={Asset.XUSD}
            logoAsset2={Asset.RBTC}
          />

          <PromotionCard
            appSection={AppSection.YieldFarm}
            backgroundColor={PromotionColor.Purple}
            title="15K SOV rewards"
            duration="Ongoing weekly rewards"
            text="Provide a 1:1 ratio of SOV and rBTC to the SOV/rBTC AMM liquidity pool and instantly start accruing your share of 15,000 SOV rewards."
            learnMoreLink="https://www.sovryn.app/blog/prepare-yourself-for-the-awakening"
            logoAsset1={Asset.SOV}
            logoAsset2={Asset.RBTC}
          />

          <PromotionCard
            appSection={AppSection.YieldFarm}
            backgroundColor={PromotionColor.Green}
            title="15K SOV rewards"
            duration="Ongoing weekly rewards"
            text="Provide a 1:1 ratio of ETH and rBTC to the ETH/rBTC AMM liquidity pool and instantly start accruing your share of 15,000 SOV rewards."
            learnMoreLink="https://www.sovryn.app/blog/over-1000-yield-for-eth-btc-lp-s"
            logoAsset1={Asset.ETH}
            logoAsset2={Asset.RBTC}
          />
        </PromotionsCarousel>
      </div>
    </div>
  );
};
