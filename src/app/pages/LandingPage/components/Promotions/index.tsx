import React from 'react';
import { PromotionsCarousel } from './components/PromotionsCarousel/index';
import { PromotionsCard } from './components/PromotionsCard';

export const Promotions: React.FC = () => (
  <div className="tw-my-20">
    <PromotionsCarousel>
      <PromotionsCard />
      <PromotionsCard />
      <PromotionsCard />
      <PromotionsCard />
      <PromotionsCard />
      <PromotionsCard />
    </PromotionsCarousel>
  </div>
);
