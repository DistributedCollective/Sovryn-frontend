import React from 'react';
import styled from 'styled-components/macro';
import LogoCircle from '../../../assets/images/logoCircle.svg';
import { media } from '../../../styles/media';

const StyledHeader = styled.div.attrs(_ => ({
  className:
    'tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-justify-center',
}))`
  justify-content: center;
  margin-bottom: 1.8em;
  margin-top: 1.3rem;
  img {
    width: 30px;
    margin-bottom: 25px;
  }
  ${media.md`
  justify-content: center;
  img {
    width: 52px;
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
  letter-spacing: 0.8rem !important;
  margin: 0;
  ${media.md`font-size: 53px; text-align: left;`}
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
