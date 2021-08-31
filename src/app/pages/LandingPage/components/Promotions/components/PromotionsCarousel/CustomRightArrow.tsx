import React from 'react';
import { ArrowProps } from 'react-multi-carousel';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyledArrow } from './styled';

export const CustomRightArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <StyledArrow onClick={() => onClick?.()}>
      <FontAwesomeIcon icon={faChevronRight} size="2x" />
    </StyledArrow>
  );
};
