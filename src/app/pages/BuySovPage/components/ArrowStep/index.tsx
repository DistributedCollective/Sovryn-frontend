import React from 'react';
import styled from 'styled-components/macro';
import image from 'assets/images/big-arrow-right.svg';

const Img = styled.img`
  width: 82px;
  height: 82px;
`;

export function ArrowStep() {
  return (
    <div
      className="d-flex justify-content-center align-items-center flex-grow-0 flex-shrink-0"
      style={{ height: 410 }}
    >
      <Img src={image} alt="Next step" />
    </div>
  );
}
