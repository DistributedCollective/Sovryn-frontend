import React from 'react';
import styled from 'styled-components/macro';
import image from 'assets/images/arrow-down.svg';

const Img = styled.img`
  width: 82px;
  height: 82px;
  margin: 25px auto;
`;

export function ArrowDown() {
  return (
    <div className="d-flex justify-content-center align-items-center flex-grow-0 flex-shrink-0">
      <Img src={image} alt="Arrow" />
    </div>
  );
}
