import React from 'react';

type RowTableProps = {
  className?: string;
};
export const RowTable: React.FC<RowTableProps> = ({ children, className }) => (
  <div className={className}>
    <table className="tw-w-full">{children}</table>
  </div>
);
