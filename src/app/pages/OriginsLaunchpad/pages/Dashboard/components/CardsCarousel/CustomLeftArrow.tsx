import React from 'react';
import { ArrowProps } from 'react-multi-carousel';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyledArrow } from './styled';

export const CustomLeftArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <StyledArrow isLeft={true} onClick={() => onClick?.()}>
      <FontAwesomeIcon icon={faChevronLeft} size="2x" />
    </StyledArrow>
  );
};
