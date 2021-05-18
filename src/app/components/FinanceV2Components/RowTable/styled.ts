import styled from 'styled-components';

export const TableWrapper = styled.div`
  width: 536px;
`;

interface ITableBodyDataProps {
  isBold?: boolean;
}

export const TableBodyData = styled.td<ITableBodyDataProps>`
  font-size: 0.75rem;
  font-weight: ${props => (props.isBold ? '600' : '100')};
`;

interface ITableHeaderProps {
  isBold?: boolean;
}
export const TableHeader = styled.th<ITableHeaderProps>`
  padding-bottom: 0.5rem;
  font-weight: ${props => (props.isBold ? '600' : '100')};
`;
