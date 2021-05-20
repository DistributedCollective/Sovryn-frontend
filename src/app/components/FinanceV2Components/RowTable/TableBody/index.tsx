import React from 'react';

export const TableBody: React.FC = ({ children }) => (
  <tbody className="tw-border-t tw-border-b">
    <tr className="tw-h-16">{children}</tr>
  </tbody>
);
