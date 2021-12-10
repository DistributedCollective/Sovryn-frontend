import { SpotPairType } from 'app/pages/SpotTradingPage/types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Asset } from 'types';
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import {
  AssetLogo,
  CardImageSection,
  CardItem,
  CardTextSection,
  CardTextTitle,
  SectionTitle,
} from './styled';
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
  linkMarginPairType?: TradingPairType;
  linkSpotTradingPairType?: SpotPairType;
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
  linkMarginPairType,
  linkSpotTradingPairType,
}) => {
  const { t } = useTranslation();

  const sectionTitle = getSectionTitle(appSection);
  const linkPathname = getLinkPathname(appSection);

  return (
    <CardItem>
      <Link
        to={{
          pathname: `/${linkPathname}`,
          state: {
            asset: linkAsset,
            target: linkTargetAsset,
            marginTradingPair: linkMarginPairType,
            spotTradingPair: linkSpotTradingPairType,
          },
        }}
        className="tw-no-underline"
      >
        <CardImageSection
          style={{
            backgroundImage: `url(${getBackgroundImageUrl(backgroundColor)})`,
          }}
        >
          <div className="tw-flex tw-justify-between tw-h-full">
            <div className="tw-w-24">
              <div className="tw-flex tw-items-center">
                <div className="tw-z-10">
                  <AssetLogo src={AssetsDictionary.get(logoAsset1).logoSvg} />
                </div>
                {logoAsset2 && (
                  <div className="tw--ml-6">
                    <AssetLogo src={AssetsDictionary.get(logoAsset2).logoSvg} />
                  </div>
                )}
              </div>
            </div>
            <div className="tw-relative">
              <SectionTitle>{sectionTitle}</SectionTitle>

              <div className="tw-max-w-60">
                <CardTextTitle>{title}</CardTextTitle>
                <div className="tw-text-xs tw-font-light tw-absolute tw-bottom-0">
                  {duration}
                </div>
              </div>
            </div>
          </div>
          <img
            className="tw-absolute tw-bottom-5  tw-right-6 tw-cursor-pointer tw-h-4"
            src={arrowForward}
            alt={title}
          />
        </CardImageSection>
      </Link>
      <CardTextSection>
        {text}{' '}
        {learnMoreLink && (
          <a
            href={learnMoreLink}
            target="_blank"
            rel="noopener noreferrer"
            className="tw-text-secondary tw-underline"
          >
            {t(translations.landingPage.promotions.learnMore)}
          </a>
        )}
      </CardTextSection>
    </CardItem>
  );
};
