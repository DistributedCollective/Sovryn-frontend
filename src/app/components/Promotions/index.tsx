import React from 'react';
import classNames from 'classnames';
import { PromotionsCarousel } from './components/PromotionsCarousel';
import { AppSection, PromotionColor } from './components/PromotionCard/types';
import { PromotionCard } from './components/PromotionCard';
import { Asset } from 'types';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import styles from './index.module.scss';
import {
  ammServiceUrl,
  currentChainId,
  learnMoreYieldFarming,
} from 'utils/classifiers';
import { useFetch } from 'app/hooks/useFetch';

type PromotionsProps = {
  className?: string;
  cardClassName?: string;
  cardImageClassName?: string;
};

export const Promotions: React.FC<PromotionsProps> = ({
  className,
  cardClassName,
  cardImageClassName,
}) => {
  const { value: ammData } = useFetch(`${ammServiceUrl[currentChainId]}/amm`);
  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        'tw-mb-14 tw-border-b tw-border-solid tw-border-sov-white',
        className,
      )}
    >
      <div className={styles.title}>
        {t(translations.landingPage.promotions.title)}
      </div>

      <div className="tw-relative tw-mb-8 tw-mt-3">
        <PromotionsCarousel className="tw-w-full">
          <PromotionCard
            appSection={AppSection.YieldFarm}
            backgroundColor={PromotionColor.Orange}
            title={t(translations.promotions.card6.title)}
            text={t(translations.promotions.card6.text)}
            duration={t(translations.promotions.card6.duration)}
            learnMoreLink={learnMoreYieldFarming}
            logoAsset1={Asset.DLLR}
            logoAsset2={Asset.RBTC}
            linkAsset={LiquidityPoolDictionary.get(Asset.DLLR, Asset.RBTC)?.key}
            linkDataActionId={`landing-promo-learnmore-${Asset.DLLR}`}
            className={cardClassName}
            imageClassName={cardImageClassName}
            ammData={
              ammData &&
              ammData[
                LiquidityPoolDictionary.get(
                  Asset.DLLR,
                  Asset.RBTC,
                ).converter.toLowerCase()
              ]
            }
            poolTokenA={
              LiquidityPoolDictionary.get(Asset.DLLR, Asset.RBTC).poolTokenA
            }
          />
          <PromotionCard
            appSection={AppSection.YieldFarm}
            backgroundColor={PromotionColor.Purple}
            title={t(translations.promotions.card4.title)}
            duration={t(translations.promotions.card4.duration)}
            text={t(translations.promotions.card4.text)}
            learnMoreLink={learnMoreYieldFarming}
            logoAsset1={Asset.SOV}
            logoAsset2={Asset.RBTC}
            linkAsset={LiquidityPoolDictionary.get(Asset.SOV, Asset.RBTC)?.key}
            linkDataActionId={`landing-promo-learnmore-${Asset.SOV}`}
            className={cardClassName}
            imageClassName={cardImageClassName}
            ammData={
              ammData &&
              ammData[
                LiquidityPoolDictionary.get(
                  Asset.SOV,
                  Asset.RBTC,
                ).converter.toLowerCase()
              ]
            }
            poolTokenA={
              LiquidityPoolDictionary.get(Asset.SOV, Asset.RBTC).poolTokenA
            }
          />
          <PromotionCard
            appSection={AppSection.YieldFarm}
            backgroundColor={PromotionColor.Yellow}
            title={t(translations.promotions.card3.title)}
            duration={t(translations.promotions.card3.duration)}
            text={t(translations.promotions.card3.text)}
            learnMoreLink={learnMoreYieldFarming}
            logoAsset1={Asset.XUSD}
            logoAsset2={Asset.RBTC}
            linkAsset={LiquidityPoolDictionary.get(Asset.XUSD, Asset.RBTC)?.key}
            linkDataActionId={`landing-promo-learnmore-${Asset.XUSD}`}
            className={cardClassName}
            imageClassName={cardImageClassName}
            ammData={
              ammData &&
              ammData[
                LiquidityPoolDictionary.get(
                  Asset.XUSD,
                  Asset.RBTC,
                ).converter.toLowerCase()
              ]
            }
            poolTokenA={
              LiquidityPoolDictionary.get(Asset.XUSD, Asset.RBTC).poolTokenA
            }
          />
        </PromotionsCarousel>
      </div>
    </div>
  );
};
