import React, { useCallback } from 'react';
import getStartedBanner from 'assets/images/banner/Zero_banner.svg';
import getStartedBannerMobile from 'assets/images/banner/Zero_banner_mobile.svg';
import { Picture } from 'app/components/Picture';
import { Breakpoint } from 'types';
import { zeroUrl } from 'utils/classifiers';
import perpetualsBanner from 'assets/images/banner/Decentralized_Perpetual.svg';
import perpetualsBannerMobile from 'assets/images/banner/Decentralized_Perpetual_Mobile.svg';
import { BannersCarousel } from './components/BannersCarousel';

const zeroSrcSet = [
  {
    src: getStartedBannerMobile,
    media: Breakpoint.sm,
  },
];

const perpetualsSrcSet = [
  {
    src: perpetualsBannerMobile,
    media: Breakpoint.sm,
  },
];

export const GetStartedBanner: React.FC = () => {
  const handleZeroBannerClick = useCallback(
    () => window.open(zeroUrl, '_blank'),
    [],
  );

  const handlePerpetualsClick = useCallback(
    () => window.open('https://www.sovryn.app/perp-futures', '_blank'),
    [],
  );

  return (
    <div className="tw-relative tw-w-full">
      <BannersCarousel>
        <div
          onClick={handlePerpetualsClick}
          data-action-id="landing-perpetuals-button"
          className="tw-cursor-pointer"
        >
          <Picture src={perpetualsBanner} srcSet={perpetualsSrcSet} />
        </div>
        <div
          onClick={handleZeroBannerClick}
          data-action-id="landing-getstarted-button"
          className="tw-cursor-pointer"
        >
          <Picture src={getStartedBanner} srcSet={zeroSrcSet} />
        </div>
      </BannersCarousel>
    </div>
  );
};
