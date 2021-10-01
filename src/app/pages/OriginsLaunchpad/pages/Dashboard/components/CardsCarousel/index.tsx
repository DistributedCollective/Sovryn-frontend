import React from 'react';
import Carousel from 'react-multi-carousel';
import { CustomLeftArrow } from './CustomLeftArrow';
import { CustomRightArrow } from './CustomRightArrow';

const responsive = {
  desktop: {
    breakpoint: { max: 4800, min: 1200 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1199, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

export const CardsCarousel: React.FC = ({ children }) => (
  <div className="tw-max-w-11/12 tw-mx-auto">
    <Carousel
      responsive={responsive}
      arrows
      centerMode
      draggable
      infinite
      keyBoardControl
      minimumTouchDrag={80}
      slidesToSlide={1}
      swipeable
      customLeftArrow={<CustomLeftArrow />}
      customRightArrow={<CustomRightArrow />}
    >
      {children}
    </Carousel>
  </div>
);
