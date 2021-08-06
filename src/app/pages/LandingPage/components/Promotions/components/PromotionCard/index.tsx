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

interface IPromotionCardProps {
  appSection: AppSection;
  backgroundColor: PromotionColor;
  title: string;
  duration: string;
  text: string;
  learnMoreLink?: string;
  linkAsset?: Asset;
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
            tradingPair: linkMarginPairType,
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
              {linkAsset && (
                <div className="tw-flex tw-items-center">
                  {/* <div className="tw-bg-background tw-rounded-full tw-z-10">
                    <AssetLogo src={AssetsDictionary.get(linkAsset).logoSvg} />
                  </div>
                  <div className="tw-bg-background tw-rounded-full tw--ml-3">
                    <AssetLogo src={AssetsDictionary.get(linkAsset).logoSvg} />
                  </div> */}
                </div>
              )}
            </div>
            <div className="tw-relative">
              <SectionTitle>{sectionTitle}</SectionTitle>

              <div className="tw-max-w-15rem">
                <CardTextTitle>{title}</CardTextTitle>
                <div className="tw-text-xs tw-font-light tw-absolute tw-bottom-0">
                  {duration}
                </div>
              </div>
            </div>
          </div>
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
