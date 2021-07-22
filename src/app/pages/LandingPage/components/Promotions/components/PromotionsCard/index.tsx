import React from 'react';
import {
  CardImageSection,
  CardItem,
  CardTextSection,
  CardImage,
  CardTextWrapper,
  CardTextTitle,
} from './styled';
import imgRbtc from 'assets/images/promoCards/RBTC_Card.png';
import imgSection from 'assets/images/promoCards/Margin_Icon.png';

export const PromotionsCard: React.FC = () => {
  return (
    <CardItem>
      <CardImageSection style={{ backgroundImage: `url(${imgRbtc})` }}>
        <div className="tw-flex tw-items-center">
          <CardImage src={imgSection} />
          <span>Margin Trading</span>
        </div>
        <CardTextWrapper>
          <CardTextTitle>Over 1000% Yield for ETH/BTC LP's</CardTextTitle>
          <div className="tw-text-xs tw-font-extralight">
            13/04/21, 12.00 UTC - 11/05/21, 12.00 UTC
          </div>
        </CardTextWrapper>
      </CardImageSection>
      <CardTextSection>
        Provide a 1:1 ratio of SOV and BTC the SOV/BTC AMM liquidity pool and
        instantly start accruing your share of 40,000 SOV rewards.
      </CardTextSection>
    </CardItem>
  );
};
