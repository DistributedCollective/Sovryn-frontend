import { ReactNode } from 'react';
import { Align, Breakpoint } from '../../../types';

export type RowObject = { [param: string]: any };

export type ColumnOptions<RowType extends RowObject> = {
  id: keyof RowType | string;
  title?: ReactNode;
  align?: Align;
  className?: string;
  hideBelow?: true | Breakpoint;
  cellRenderer?: (
    row: RowType,
    columnId: ColumnOptions<RowType>['id'],
  ) => ReactNode;
};
