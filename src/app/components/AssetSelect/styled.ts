import styled from 'styled-components';

export const AssetSelectItemWrapper = styled.li`
  min-width: 150px;
  cursor: pointer;
  transition: all 0.3s;
  &:nth-child(odd) {
    background-color: #e8e8e8;
  }
  &:hover {
    background-color: #c8c8c8;
  }
`;
