import React from 'react';
import styled from 'styled-components/macro';
import LogoCircle from '../../../assets/images/logoCircle.svg';

const StyledHeader = styled.div`
  font-size: 53px;
  font-family: 'Rowdies';
  display: flex;
  justify-content: center;
  img {
    margin-right: 25px;
  }
  margin-bottom: 0.6em;
  @media only screen and (max-width: 600px) {
    font-size: 30px;
    img {
      width: 30px;
    }
  }
`;

export default function PageHeader() {
  return (
    <StyledHeader>
      <img src={LogoCircle} alt="SOV" />S O V* &nbsp;&nbsp;G E N E S I
      S&nbsp;&nbsp;&nbsp;&nbsp;S A L E
    </StyledHeader>
  );
}
