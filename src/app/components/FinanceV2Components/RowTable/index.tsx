import cn from 'classnames';
import React from 'react';

type RowTableProps = {
  className?: string;
};
export const RowTable: React.FC<RowTableProps> = ({ children, className }) => (
  <div className={cn('xl:tw-w-139 2xl:tw-w-155', className)}>
    <table className="w-100">{children}</table>
  </div>
);
