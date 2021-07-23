import React from 'react';
import { UpcomingSalesCard } from '../UpcomingSalesCard';
import 'react-multi-carousel/lib/styles.css';
import imgBabelfish from 'assets/origins_launchpad/BABELFISH_NFT.svg';

export const UpcomingSalesCardSection: React.FC = () => (
  <UpcomingSalesCard
    saleToken="FISH Token"
    project="babelFish"
    startDate="TBC"
    startPrice="TBC"
    backgroundImage={imgBabelfish}
  />
);
