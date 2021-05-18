import React from 'react';
import { TableWrapper } from './styled';

export const RowTable: React.FC = ({ children }) => (
  <TableWrapper>
    <table className="w-100">{children}</table>
  </TableWrapper>
);
