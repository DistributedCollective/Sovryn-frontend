import React from 'react';
import styled from 'styled-components/macro';
import image from 'assets/images/arrow-down.svg';

const Img = styled.img`
  width: 40px;
  height: 40px;
  margin: 15px auto;
`;

export function ArrowDown() {
  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0">
      <Img src={image} alt="Arrow" />
    </div>
  );
}
