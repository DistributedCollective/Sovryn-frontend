import React from 'react';
import styled from 'styled-components/macro';
import LogoCircle from '../../../assets/images/logoCircle.svg';
import { media } from '../../../styles/media';

const StyledHeader = styled.div.attrs(_ => ({
  className:
    'd-flex flex-column flex-md-row align-items-center justify-content-center',
}))`
  justify-content: center;
  margin-bottom: 30px;
  margin-top: 54px;
  img {
    width: 30px;
    margin-bottom: 25px;
  }
  ${media.md`
  justify-content: center;
  img {
    width: 52px;
    height: 52px;
    margin-bottom: 0px;
    margin-right: 25px;
  }
  `}
`;

const H1 = styled.h1`
  font-size: 24px;
  font-family: 'Montserrat';
  text-align: center;
  font-weight: bold;
  letter-spacing: 0;
  margin: 0;
  text-transform: none;
  ${media.md`font-size: 36px; line-height: 47px; text-align: center;`}
`;

interface Props {
  content?: React.ReactNode;
}

export default function PageHeader(props: Props) {
  return (
    <StyledHeader>
      <img src={LogoCircle} alt="SOV" />
      <H1>{props.content}</H1>
    </StyledHeader>
  );
}
