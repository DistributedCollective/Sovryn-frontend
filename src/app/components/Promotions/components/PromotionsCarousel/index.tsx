import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { CustomLeftArrow } from './CustomLeftArrow';
import { CustomRightArrow } from './CustomRightArrow';
import { CustomDot } from './CustomDot';

const responsive = {
  large: {
    breakpoint: { max: 4800, min: 1536 },
    items: 3,
    slidesToSlide: 2,
  },
  desktop: {
    breakpoint: { max: 1536, min: 1199 },
    items: 3,
    slidesToSlide: 2,
  },
  tablet: {
    breakpoint: { max: 1199, min: 992 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 992, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

type PromotionsCarouselProps = {
  children?: React.ReactNode;
  className?: string;
};

export const PromotionsCarousel: React.FC<PromotionsCarouselProps> = ({
  children,
  className,
}) => {
  return (
    <div className={className}>
      <Carousel
        arrows
        responsive={responsive}
        draggable
        focusOnSelect={false}
        minimumTouchDrag={80}
        renderDotsOutside
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        customDot={<CustomDot />}
        showDots
        swipeable
      >
        {children}
      </Carousel>
    </div>
  );
};
