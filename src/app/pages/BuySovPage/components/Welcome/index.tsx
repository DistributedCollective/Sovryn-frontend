import React from 'react';
import styled from 'styled-components/macro';
import image from 'assets/images/sov-welcome.svg';

const Img = styled.img`
  width: 688px;
  height: 185px;
  margin-top: 40px;
  @media (max-width: 1200px) {
    display: none;
  }
`;

export function Welcome() {
  return (
    <div className="d-flex justify-content-xl-start justify-content-center align-items-center flex-grow-0 flex-shrink-0">
      <Img src={image} alt="Welcome" />
    </div>
  );
}
