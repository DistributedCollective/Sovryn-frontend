import classNames from 'classnames';
import React, { useMemo } from 'react';
import { ButtonGroupProps } from 'react-multi-carousel';
import { ArrowType, CustomArrow } from './CustomArrow';
import styles from './index.module.scss';

export const CustomButtonGroup = ({
  next,
  previous,
  ...rest
}: ButtonGroupProps) => {
  const { carouselState } = rest;
  const totalItems = carouselState?.totalItems || 0;

  const isFirstSlide = useMemo(() => carouselState?.currentSlide === 0, [
    carouselState?.currentSlide,
  ]);

  const isLastSlide = useMemo(
    () => carouselState?.slidesToShow === carouselState?.currentSlide,
    [carouselState?.currentSlide, carouselState?.slidesToShow],
  );

  const isNotPaginated = useMemo(
    () =>
      carouselState && carouselState.slidesToShow > carouselState.totalItems,
    [carouselState],
  );

  if (totalItems === 0 || !next || !previous) {
    return null;
  }

  return (
    <>
      <CustomArrow
        arrowType={ArrowType.LEFT}
        className={classNames(styles.leftArrow, {
          'tw-opacity-50 tw-cursor-not-allowed': isFirstSlide,
        })}
        onClick={previous}
      />
      <CustomArrow
        arrowType={ArrowType.RIGHT}
        className={classNames(styles.rightArrow, {
          'tw-opacity-50 tw-cursor-not-allowed': isLastSlide || isNotPaginated,
        })}
        onClick={next}
      />
    </>
  );
};
