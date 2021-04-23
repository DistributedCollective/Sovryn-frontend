import React from 'react';
import styled from 'styled-components/macro';
import image from 'assets/images/big-arrow-right.svg';

const Img = styled.img`
  width: 82px;
  height: 82px;
`;

export function ArrowStep() {
  return <Img src={image} alt="Next step" />;
}
