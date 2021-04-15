import React from 'react';
import styled from 'styled-components/macro';
import image from 'assets/images/sov-welcome.svg';

const Img = styled.img`
  width: 688px;
  height: 185px;
  margin-top: 50px;
`;

export function Welcome() {
  return <Img src={image} alt="Welcome" />;
}
