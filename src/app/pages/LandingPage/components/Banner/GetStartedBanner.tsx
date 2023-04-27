import React, { useCallback } from 'react';
import getStartedBanner from 'assets/images/banner/Zero_banner.svg';
import getStartedBannerMobile from 'assets/images/banner/Zero_banner_mobile.svg';
import { Picture } from 'app/components/Picture';
import { Breakpoint } from 'types';
import { D2_URL } from 'utils/classifiers';

const zeroSrcSet = [
  {
    src: getStartedBannerMobile,
    media: Breakpoint.sm,
  },
];

// const perpetualsSrcSet = [
//   {
//     src: perpetualsBannerMobile,
//     media: Breakpoint.sm,
//   },
// ];

export const GetStartedBanner: React.FC = () => {
  const handleZeroBannerClick = useCallback(
    () => window.open(D2_URL, '_blank'),
    [],
  );

  // const handlePerpetualsClick = useCallback(
  //   () => window.open('https://www.sovryn.app/perp-futures', '_blank'),
  //   [],
  // );

  return (
    <div className="tw-relative tw-w-full">
      {/* <BannersCarousel> */}
      {/* <div
          onClick={handlePerpetualsClick}
          data-action-id="landing-perpetuals-button"
          className="tw-cursor-pointer"
        >
          <Picture src={perpetualsBanner} srcSet={perpetualsSrcSet} />
        </div> */}
      <div
        onClick={handleZeroBannerClick}
        data-action-id="landing-getstarted-button"
        className="tw-cursor-pointer"
      >
        <Picture src={getStartedBanner} srcSet={zeroSrcSet} />
      </div>
      {/* </BannersCarousel> */}
    </div>
  );
};
