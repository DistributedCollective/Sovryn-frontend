import React from 'react';
import classNames from 'classnames';
import { PromotionsCarousel } from './components/PromotionsCarousel';
import { AppSection, PromotionColor } from './components/PromotionCard/types';
import { PromotionCard } from './components/PromotionCard';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styles from './index.module.scss';
import { learnMoreYieldFarming } from 'utils/classifiers';
import { useGetPromotionsData } from './hooks/useGetPromotionsData';
import { PLACEHOLDER_PROMOTION } from './types';

type PromotionsProps = {
  className?: string;
  cardClassName?: string;
  cardImageClassName?: string;
  carouselClassName?: string;
  customDurationText?: string;
  dataAttributePrefix?: string;
};

export const Promotions: React.FC<PromotionsProps> = ({
  className,
  cardClassName,
  cardImageClassName,
  carouselClassName,
  customDurationText,
  dataAttributePrefix,
}) => {
  const { t } = useTranslation();

  const { data, loading } = useGetPromotionsData();

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
        <PromotionsCarousel className={carouselClassName || 'tw-w-full'}>
          {loading && (
            <div className="tw-invisible">
              <PromotionCard
                appSection={AppSection.YieldFarm}
                backgroundColor={PromotionColor.Orange}
                title={t(translations.promotions.title)}
                text={t(translations.promotions.text)}
                duration={
                  customDurationText || t(translations.promotions.duration)
                }
                learnMoreLink={learnMoreYieldFarming}
                logoAsset1={PLACEHOLDER_PROMOTION.asset1}
                linkAsset={PLACEHOLDER_PROMOTION.linkAsset}
                className={cardClassName}
                imageClassName={cardImageClassName}
                ammData={PLACEHOLDER_PROMOTION.ammData}
                poolTokenA={PLACEHOLDER_PROMOTION.poolTokenA}
              />
            </div>
          )}

          {!loading &&
            data.map(item => (
              <PromotionCard
                key={item.asset1}
                appSection={AppSection.YieldFarm}
                backgroundColor={item.promotionColor}
                title={t(translations.promotions.title, {
                  rewardAmount: `${item.rewardAmount / 1000}K`,
                })}
                text={t(translations.promotions.text, {
                  asset1: item.asset1,
                  asset2: item.asset2,
                  rewardAmount: item.rewardAmount.toLocaleString(
                    navigator.language,
                  ),
                })}
                duration={
                  customDurationText || t(translations.promotions.duration)
                }
                learnMoreLink={learnMoreYieldFarming}
                logoAsset1={item.asset1}
                logoAsset2={item.asset2}
                linkAsset={item.linkAsset}
                linkDataActionId={`${dataAttributePrefix}-${item.asset1}`}
                className={cardClassName}
                imageClassName={cardImageClassName}
                ammData={item.ammData}
                poolTokenA={item.poolTokenA}
              />
            ))}
        </PromotionsCarousel>
      </div>
    </div>
  );
};
