import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { CustomDot } from './CustomDot';

const responsive = {
  large: {
    breakpoint: { max: 4800, min: 1536 },
    items: 1,
    slidesToSlide: 1,
  },
  desktop: {
    breakpoint: { max: 1536, min: 1199 },
    items: 1,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1199, min: 992 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 992, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

type BannersCarouselProps = {
  children?: React.ReactNode;
  className?: string;
};

export const BannersCarousel: React.FC<BannersCarouselProps> = ({
  children,
  className,
}) => {
  return (
    <div className={className}>
      <Carousel
        arrows={false}
        responsive={responsive}
        draggable
        focusOnSelect={false}
        infinite
        minimumTouchDrag={80}
        renderDotsOutside
        customDot={<CustomDot />}
        showDots
        swipeable
        autoPlay
        autoPlaySpeed={20000}
        dotListClass="tw--bottom-6"
        className="tw-relative"
      >
        {children}
      </Carousel>
    </div>
  );
};
