import React from 'react';
import cn from 'classnames';

type RowTableProps = {
  className?: string;
};
export const RowTable: React.FC<RowTableProps> = ({ children, className }) => (
  <div className={cn('xl:tw-w-139 2xl:tw-w-163', className)}>
    <table className="tw-w-full">{children}</table>
  </div>
);
