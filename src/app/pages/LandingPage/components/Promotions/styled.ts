import styled from 'styled-components';

export const Title = styled.div`
  text-align: center;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: 13px 0;
  grid-gap: 20px;

  &:after,
  &:before {
    content: ' ';
    display: block;
    border-bottom: 1px solid;
  }
`;
