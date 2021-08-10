import React from 'react';
import styled from 'styled-components/macro';
import image from 'assets/images/sov-welcome.svg';

const Img = styled.img`
  width: 688px;
  height: 185px;
  margin-top: 40px;
  @media (max-width: 640px) {
    width: auto;
    height: auto;
    max-width: 100%;
  }
`;

export function Welcome() {
  return (
    <div className="tw-flex xl:tw-justify-start tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0">
      <Img src={image} alt="Welcome" />
    </div>
  );
}
