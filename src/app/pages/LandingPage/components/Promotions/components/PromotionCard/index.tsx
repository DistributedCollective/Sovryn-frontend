import React from 'react';
import {
  CardImageSection,
  CardItem,
  CardTextSection,
  CardImage,
  CardTextTitle,
} from './styled';
import { Asset } from 'types';
import { AppSection } from './types';
import { getSectionData, getBackgroundImageUrl } from './utils';

interface IPromotionCardProps {
  appSection: AppSection;
  asset: Asset;
  title: string;
  duration: string;
  text: string;
}

export const PromotionCard: React.FC<IPromotionCardProps> = ({
  appSection,
  asset,
  title,
  duration,
  text,
}) => {
  const { imageUrl: sectionImageUrl, title: sectionTitle } = getSectionData(
    appSection,
  );

  return (
    <CardItem>
      <CardImageSection
        style={{ backgroundImage: `url(${getBackgroundImageUrl(asset)})` }}
      >
        <div className="tw-flex tw-items-center">
          <CardImage src={sectionImageUrl} />
          <span className="tw-leading-4 tw-self-end tw-font-light">
            . {sectionTitle}
          </span>
        </div>
        <div>
          <CardTextTitle>{title}</CardTextTitle>
          <div className="tw-text-xs tw-font-extralight">{duration}</div>
        </div>
      </CardImageSection>
      <CardTextSection>{text}</CardTextSection>
    </CardItem>
  );
};
