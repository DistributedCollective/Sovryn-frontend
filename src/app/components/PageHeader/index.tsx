import React from 'react';
import styled from 'styled-components';
import LogoCircle from '../../../assets/images/logoCircle.svg';

const StyledHeader = styled.div`
  font-size: 53px;
  display: flex;
  justify-content: center;
  img {
    margin-right: 25px;
  }
  margin-bottom: 0.6em;
`;

export default function PageHeader() {
  return (
    <StyledHeader>
      <img src={LogoCircle} alt="SOV" />
      SOV* GENESIS SALE
    </StyledHeader>
  );
}
