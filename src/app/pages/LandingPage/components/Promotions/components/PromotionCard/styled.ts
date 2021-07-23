import styled from 'styled-components';

export const CardItem = styled.div`
  width: 23.1875rem;
  margin-top: 2.5rem;
  margin-bottom: 3.125rem;
`;

export const CardImageSection = styled.div`
  height: 11.9375rem;
  width: 100%;
  border: 1px solid #e9eae9;
  border-radius: 0.5rem;
  margin-bottom: 1.375rem;
  position: relative;
  padding: 1rem 5.6rem 1rem 1.625rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CardTextSection = styled.div`
  padding-left: 0.625rem;
  padding-right: 0.625rem;
  font-size: 0.75rem;
  font-weight: 300;
  line-height: 1.25rem;
  letter-spacing: 0;
`;

export const CardImage = styled.img`
  width: 28px;
  height: 31px;
  margin-right: 0.625rem;
`;

export const CardTextTitle = styled.div`
  font-size: 1.75rem;
  line-height: 2.25rem;
  letter-spacing: 0;
  font-weight: 600;
  margin-bottom: 0.625rem;
`;
