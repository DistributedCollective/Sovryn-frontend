import styled from 'styled-components';

export const PreviousSalesRowWrapper = styled.div`
  border: 0.5px solid #ffffff;
  border-radius: 0.5rem;
  padding: 0.5rem 0.25rem;
  margin-top: 2.5rem;

  @media (min-width: 768px) {
    padding: 1rem 1.25rem;
  }
`;

export const PreviousSalesRow = styled.div`
  display: flex;
  background-color: #1f1f1f;
  border-radius: 0.75rem;
  padding: 1.5rem 1rem;
  flex-direction: column;
  align-items: center;

  @media (min-width: 576px) {
    padding: 2.5rem 1rem;
  }

  @media (min-width: 1200px) {
    flex-direction: row;
    padding: 2.5rem;
  }
`;
