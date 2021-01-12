import React from 'react';
import styled from 'styled-components/macro';
import LogoCircle from '../../../assets/images/logoCircle.svg';
import { media } from '../../../styles/media';

const StyledHeader = styled.div.attrs(_ => ({
  className:
    'd-flex flex-column flex-md-row align-items-center justify-content-center',
}))`
  justify-content: center;
  margin-bottom: 3em;
  img {
    width: 30px;
    margin-bottom: 25px;
  }
  ${media.md`
  justify-content: center;
  img {
    width: 60px;
    margin-bottom: 0px;
    margin-right: 25px;
  }
  `}
`;

const H1 = styled.h1`
  font-size: 24px;
  font-family: 'Rowdies';
  text-align: center;
  letter-spacing: 3px;
  ${media.md`font-size: 53px; text-align: left;`}
`;

export default function PageHeader() {
  return (
    <StyledHeader>
      <img src={LogoCircle} alt="SOV" />
      <H1>SOV* GENESIS SALE</H1>
    </StyledHeader>
  );
}
