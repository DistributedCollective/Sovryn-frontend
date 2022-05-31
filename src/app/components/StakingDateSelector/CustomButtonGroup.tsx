import classNames from 'classnames';
import React, { useMemo } from 'react';
import { ButtonGroupProps, CarouselInternalState } from 'react-multi-carousel';
import { ArrowType, CustomArrow } from './CustomArrow';

const emptyCarouselState: CarouselInternalState = {
  itemWidth: 0,
  containerWidth: 0,
  slidesToShow: 0,
  currentSlide: 0,
  totalItems: 0,
  domLoaded: false,
  deviceType: '',
  transform: 0,
};

export const CustomButtonGroup = ({
  next,
  previous,
  carouselState,
  ...rest
}: ButtonGroupProps) => {
  const { totalItems, currentSlide, slidesToShow } =
    carouselState || emptyCarouselState;

  const isFirstSlide = useMemo(() => currentSlide === 0, [currentSlide]);

  const isLastSlide = useMemo(
    () => slidesToShow + currentSlide === totalItems,
    [currentSlide, slidesToShow, totalItems],
  );

  const isNotPaginated = useMemo(() => slidesToShow >= totalItems, [
    slidesToShow,
    totalItems,
  ]);

  if (totalItems === 0 || isNotPaginated || !next || !previous) {
    return null;
  }

  return (
    <>
      <CustomArrow
        arrowType={ArrowType.LEFT}
        className={classNames(
          'tw-absolute tw-top-0 tw-cursor-pointer tw--left-8',
          {
            'tw-opacity-25 tw-cursor-not-allowed': isFirstSlide,
          },
        )}
        onClick={previous}
        dataActionId={`staking-${ArrowType.LEFT}Button`}
      />
      <CustomArrow
        arrowType={ArrowType.RIGHT}
        className={classNames(
          'tw-absolute tw-top-0 tw-cursor-pointer tw--right-8',
          {
            'tw-opacity-25 tw-cursor-not-allowed': isLastSlide,
          },
        )}
        onClick={next}
        dataActionId={`staking-${ArrowType.RIGHT}Button`}
      />
    </>
  );
};
