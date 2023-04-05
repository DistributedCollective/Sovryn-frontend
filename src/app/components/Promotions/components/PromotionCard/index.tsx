import { SpotPairType } from 'app/pages/SpotTradingPage/types';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Asset } from 'types';
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { AppSection, PromotionColor } from './types';
import {
  getSectionTitle,
  getBackgroundImageUrl,
  getLinkPathname,
} from './utils';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import arrowForward from 'assets/images/arrow_forward.svg';
import styles from './index.module.scss';
import { AmmHistory } from 'app/pages/LiquidityMining/components/MiningPool/types';

interface IPromotionCardProps {
  appSection: AppSection;
  backgroundColor: PromotionColor;
  title: string;
  duration: string;
  text: string;
  logoAsset1: Asset;
  logoAsset2?: Asset;
  learnMoreLink?: string;
  linkAsset?: Asset | string;
  linkTargetAsset?: Asset;
  linkDataActionId?: string;
  linkMarginPairType?: TradingPairType;
  linkSpotTradingPairType?: SpotPairType;
  className?: string;
  imageClassName?: string;
  ammData: AmmHistory;
  poolTokenA: string;
}

export const PromotionCard: React.FC<IPromotionCardProps> = ({
  appSection,
  backgroundColor,
  title,
  duration,
  text,
  logoAsset1,
  logoAsset2,
  learnMoreLink,
  linkAsset,
  linkTargetAsset,
  linkDataActionId,
  linkMarginPairType,
  linkSpotTradingPairType,
  className,
  imageClassName,
  ammData,
  poolTokenA,
}) => {
  const { t } = useTranslation();
  const sectionTitle = getSectionTitle(appSection);
  const linkPathname = getLinkPathname(appSection);

  const apy = useMemo(() => {
    if (!poolTokenA || !ammData) {
      return '';
    }
    return ammData?.data[poolTokenA][ammData?.data[poolTokenA].length - 1]
      .APY_pc;
  }, [ammData, poolTokenA]);

  return (
    <div className={classNames(styles.cardItem, className)}>
      <Link
        to={{
          pathname: `/${linkPathname}`,
          state: {
            asset: linkAsset,
            target: linkTargetAsset,
            marginTradingPair: linkMarginPairType,
            spotTradingPair: linkSpotTradingPairType,
            promotionSelectedAsset: logoAsset1,
          },
        }}
        className="tw-no-underline"
      >
        <div
          className={classNames(styles.cardImageSection, imageClassName)}
          style={{
            backgroundImage: `url(${getBackgroundImageUrl(backgroundColor)})`,
          }}
          data-action-id={`landing-promo-banner-${linkPathname}-${logoAsset1}${
            logoAsset2 ? `-${logoAsset2}` : ''
          }`}
        >
          <div className="tw-flex tw-justify-between tw-h-full">
            <div className="tw-w-24">
              <div className="tw-flex tw-items-center">
                <div className="tw-z-10">
                  <img
                    className={styles.assetLogo}
                    src={AssetsDictionary.get(logoAsset1).logoSvg}
                    alt={logoAsset1}
                  />
                </div>
                {logoAsset2 && (
                  <div className="tw--ml-6">
                    <img
                      className={styles.assetLogo}
                      src={AssetsDictionary.get(logoAsset2).logoSvg}
                      alt={logoAsset2}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="tw-relative">
              <div className={styles.sectionTitle}>
                {apy ? t(translations.promotions.apy, { apy }) : sectionTitle}
              </div>

              <div className="tw-max-w-56">
                <div className={styles.cardTextTitle}>{title}</div>
                <div className="tw-text-xs tw-font-normal tw-absolute tw-bottom-0">
                  {duration}
                </div>
              </div>
            </div>
          </div>
          <img
            className="tw-absolute tw-bottom-5 tw-right-6 tw-cursor-pointer tw-h-4"
            src={arrowForward}
            alt={title}
          />
        </div>
      </Link>
      <div className="tw-px-2.5 tw-text-xs tw-font-normal tw-leading-5 tw-tracking-normal">
        {text}{' '}
        {learnMoreLink && (
          <a
            href={learnMoreLink}
            target="_blank"
            rel="noopener noreferrer"
            className="tw-text-secondary tw-underline"
            data-action-id={linkDataActionId}
          >
            {t(translations.landingPage.promotions.learnMore)}
          </a>
        )}
      </div>
    </div>
  );
};
