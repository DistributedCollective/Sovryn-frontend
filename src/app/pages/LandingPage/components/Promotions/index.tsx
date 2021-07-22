import { UpcomingSalesCard } from 'app/pages/OriginsLaunchpad/pages/Dashboard/components/UpcomingSalesCard';
import React from 'react';
import { PromotionsCarousel } from './components/PromotionsCarousel/index';
import imgBabelfish from 'assets/origins_launchpad/BABELFISH_NFT.svg';

export const Promotions: React.FC = () => (
  <div className="tw-my-20">
    <PromotionsCarousel>
      <UpcomingSalesCard
        saleToken="FISH Token"
        project="babelFish"
        startDate="TBC"
        startPrice="TBC"
        backgroundImage={imgBabelfish}
      />
      <UpcomingSalesCard
        saleToken="FISH Token"
        project="babelFish"
        startDate="TBC"
        startPrice="TBC"
        backgroundImage={imgBabelfish}
      />

      <UpcomingSalesCard
        saleToken="FISH Token"
        project="babelFish"
        startDate="TBC"
        startPrice="TBC"
        backgroundImage={imgBabelfish}
      />
      <UpcomingSalesCard
        saleToken="FISH Token"
        project="babelFish"
        startDate="TBC"
        startPrice="TBC"
        backgroundImage={imgBabelfish}
      />
      <UpcomingSalesCard
        saleToken="FISH Token"
        project="babelFish"
        startDate="TBC"
        startPrice="TBC"
        backgroundImage={imgBabelfish}
      />
      <UpcomingSalesCard
        saleToken="FISH Token"
        project="babelFish"
        startDate="TBC"
        startPrice="TBC"
        backgroundImage={imgBabelfish}
      />
    </PromotionsCarousel>
  </div>
);
