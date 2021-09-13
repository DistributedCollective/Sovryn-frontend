import styled from 'styled-components';

export const CardImage = styled.div`
  width: 18.6875rem;
  height: 24.8125rem;
  margin-bottom: 1rem;

  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;

  @media (min-width: 576px) {
    margin-bottom: 0;
  }
  @media (min-width: 1200px) {
    width: 14rem;
    height: 18.5885rem;
  }
  @media (min-width: 1440px) {
    width: 18.6875rem;
    height: 24.8125rem;
  }
`;

export const InfoRowValue = styled.div`
  font-family: 'Orbitron', 'sans-serif';
  font-size: 0.875rem;
  letter-spacing: 0;
  line-height: 1.25;
  margin-top: 0.25rem;
  font-weight: 500;
`;
