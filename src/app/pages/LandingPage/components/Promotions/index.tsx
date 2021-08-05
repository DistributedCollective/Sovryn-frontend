import React from 'react';
import { PromotionsCarousel } from './components/PromotionsCarousel/index';
import { AppSection, PromotionColor } from './components/PromotionCard/types';
import { PromotionCard } from './components/PromotionCard';
import { Asset } from 'types';
import { Title } from './styled';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { SpotPairType } from 'app/pages/SpotTradingPage/types';

export const Promotions: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="tw-my-20 tw-border-b tw-border-solid tw-border-white">
      <Title>{t(translations.landingPage.promotions.title)}</Title>

      <div className="tw-relative tw-mb-8">
        <PromotionsCarousel>
          <PromotionCard
            appSection={AppSection.Lend}
            backgroundColor={PromotionColor.Yellow}
            title="35K SOV rewards"
            duration="Until 11/05/21, 12.00 UTC"
            text="Provide a 1:1 ratio of SOV and BTC the SOV/BTC AMM liquidity pool and instantly start accruing your share of 40,000 SOV rewards."
            linkAsset={Asset.BPRO}
          />

          <PromotionCard
            appSection={AppSection.YieldFarm}
            backgroundColor={PromotionColor.LightGreen}
            title="25K SOV rewards"
            duration="Until 11/05/21, 12.00 UTC"
            text="Provide a 1:1 ratio of SOV and BTC the SOV/BTC AMM liquidity pool and instantly start accruing your share of 40,000 SOV rewards."
            linkAsset={Asset.SOV}
          />

          <PromotionCard
            appSection={AppSection.Borrow}
            backgroundColor={PromotionColor.Blue}
            title="40K SOV rewards"
            duration="Until 11/05/21, 12.00 UTC"
            text="Provide a 1:1 ratio of SOV and BTC the SOV/BTC AMM liquidity pool and instantly start accruing your share of 40,000 SOV rewards."
            linkAsset={Asset.DOC}
          />

          <PromotionCard
            appSection={AppSection.MarginTrade}
            backgroundColor={PromotionColor.DarkYellow}
            title="1000% Yield for ETH/BTC LP's"
            duration="Until 11/05/21, 12.00 UTC"
            text="Provide a 1:1 ratio of SOV and BTC the SOV/BTC AMM liquidity pool and instantly start accruing your share of 40,000 SOV rewards."
            linkMarginPairType={TradingPairType.RBTC_DOC}
          />

          <PromotionCard
            appSection={AppSection.Swap}
            backgroundColor={PromotionColor.Turquoise}
            title="1000% Yield for ETH/BTC LP's"
            duration="Until 11/05/21, 12.00 UTC"
            text="Provide a 1:1 ratio of SOV and BTC the SOV/BTC AMM liquidity pool and instantly start accruing your share of 40,000 SOV rewards."
            linkAsset={Asset.BPRO}
            linkTargetAsset={Asset.XUSD}
          />

          <PromotionCard
            appSection={AppSection.Spot}
            backgroundColor={PromotionColor.Orange}
            title="10% Yield for ETH/BTC LP's"
            duration="Until 11/05/21, 12.00 UTC"
            text="Provide a 1:1 ratio of SOV and BTC the SOV/BTC AMM liquidity pool and instantly start accruing your share of 40,000 SOV rewards."
            linkSpotTradingPairType={SpotPairType.SOV_BNB}
          />
        </PromotionsCarousel>
      </div>
    </div>
  );
};
