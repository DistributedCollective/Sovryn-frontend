import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styles from './index.module.scss';

enum Breakpoint {
  'sm' = 'sm',
  'md' = 'md',
  'lg' = 'lg',
  'xl' = 'xl',
  '2xl' = '2xl',
  '3xl' = '3xl',
}

type RowObject = { [param: string]: any };

type ColumnOptions<RowType extends RowObject> = {
  id: keyof RowType | string;
  title?: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  hideBelow?: Breakpoint | null;
  cellRenderer?: (
    row: RowType,
    index: number,
    columnId: ColumnOptions<RowType>['id'],
  ) => ReactNode;
};

type ITableProps<RowType extends RowObject> = {
  className?: string;
  columns: ColumnOptions<RowType>[];
  rows?: RowType[];
  rowKey?: (row: RowType) => number | string;
  noData?: ReactNode;
  showReadMore?: boolean;
};

// No React.FC, since it doesn't work with Generic PropType
export const Table = <RowType extends RowObject>({
  className,
  columns,
  rows,
  rowKey,
  noData,
  showReadMore,
}: ITableProps<RowType>) => {
  const { t } = useTranslation();

  return (
    <div className={classNames('tw-overflow-auto', className)}>
      <table className="tw-w-full tw-min-w-auto tw-h-full tw-min-h-auto">
        <thead className={styles.head}>
          <tr>
            {columns.map(column => (
              <th
                key={column.id.toString()}
                className={classNames(
                  styles.headCell,
                  column.className,
                  column.hideBelow &&
                    `tw-hidden ${column.hideBelow}:tw-table-cell`,
                  column.align && `tw-text-${column.align}`,
                )}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows && rows.length >= 1 ? (
            rows.map((row, index) => (
              <TableRow
                key={rowKey?.(row) || JSON.stringify(row)}
                columns={columns}
                row={row}
                index={index}
                showReadMore={showReadMore}
              />
            ))
          ) : (
            <tr className={classNames(styles.row, styles.even)}>
              <td
                className={classNames(styles.cell, 'tw-text-center')}
                colSpan={999}
              >
                {noData ? noData : t(translations.common.noData)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

type ITableRowProps<RowType extends RowObject> = {
  columns: ITableProps<RowType>['columns'];
  row: RowType;
  index: number;
  showReadMore?: boolean;
};

const TableRow = <RowType extends RowObject>({
  columns,
  row,
  index,
  showReadMore,
}: ITableRowProps<RowType>) => {
  const [open, setOpen] = useState(false);

  const rowElement = (
    <tr
      className={classNames(
        styles.row,
        index % 2 === 0 && styles.even,
        open && styles.open,
      )}
    >
      {columns.map(column => {
        return (
          <td
            key={column.id.toString()}
            className={classNames(
              styles.cell,
              column.hideBelow && `tw-hidden ${column.hideBelow}:tw-table-cell`,
              column.align && `tw-text-${column.align}`,
            )}
          >
            {column.cellRenderer
              ? column.cellRenderer(row, index, column.id)
              : row[column.id]}
          </td>
        );
      })}
    </tr>
  );

  return showReadMore ? (
    <>
      {rowElement}
      {open && (
        <tr
          className={classNames(
            index % 2 === 0 && styles.even,
            styles.readMoreRow,
          )}
        >
          <td className={styles.cell} colSpan={999}>
            Not implemented yet
          </td>
        </tr>
      )}
    </>
  ) : (
    rowElement
  );
};
