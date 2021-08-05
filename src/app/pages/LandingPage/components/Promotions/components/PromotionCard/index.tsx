import { SpotPairType } from 'app/pages/SpotTradingPage/types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Asset } from 'types';
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import {
  CardImageSection,
  CardItem,
  CardTextSection,
  CardTextTitle,
} from './styled';
import { AppSection, PromotionColor } from './types';
import {
  getSectionTitle,
  getBackgroundImageUrl,
  getLinkPathname,
} from './utils';

interface IPromotionCardProps {
  appSection: AppSection;
  backgroundColor: PromotionColor;
  title: string;
  duration: string;
  text: string;
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
  linkAsset,
  linkTargetAsset,
  linkMarginPairType,
  linkSpotTradingPairType,
}) => {
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
          <div className="tw-flex tw-justify-between">
            <div className="tw-w-24"></div>
            <div>
              <div className="tw-mb-5">
                <span className="tw-leading-4 tw-self-end tw-font-light">
                  {sectionTitle}
                </span>
              </div>
              <div className="tw-max-w-15rem tw-flex tw-flex-col tw-justify-between">
                <CardTextTitle>{title}</CardTextTitle>
                <div className="tw-text-xs tw-font-extralight">{duration}</div>
              </div>
            </div>
          </div>
        </CardImageSection>
      </Link>
      <CardTextSection>{text}</CardTextSection>
    </CardItem>
  );
};
