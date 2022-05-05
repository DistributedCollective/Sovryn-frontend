import React, { useCallback } from 'react';
import detailsIcon from 'assets/images/ellipsis-h.svg';
import { BreakpointWidths, Breakpoint } from '../../../../../types';
import classNames from 'classnames';
import { RowObject, ColumnOptions } from '../../types';
import styles from './index.module.scss';

type TableRowProps<RowType extends RowObject> = {
  columns: ColumnOptions<RowType>[];
  row: RowType;
  index: number;
  showDetailsBelow?: true | Breakpoint;
  onShowDetails?: (row: RowType) => void;
};

export const TableRow = <RowType extends RowObject>({
  columns,
  row,
  index,
  showDetailsBelow,
  onShowDetails,
}: TableRowProps<RowType>) => {
  const onShowDetailsWrapped = useCallback(() => onShowDetails?.(row), [
    onShowDetails,
    row,
  ]);

  const onRowClick = useCallback(
    (event: React.MouseEvent) => {
      if (showDetailsBelow && window.innerWidth < BreakpointWidths.sm) {
        onShowDetailsWrapped();
      }
    },
    [showDetailsBelow, onShowDetailsWrapped],
  );

  const rowElement = (
    <tr className={styles.row} onClick={onRowClick}>
      {columns.map(column =>
        column.hideBelow === true ? null : (
          <td
            key={column.id.toString()}
            className={classNames(
              'tw-relative tw-px-4 tw-py-4',
              column.hideBelow && `tw-hidden ${column.hideBelow}:tw-table-cell`,
              column.align && `tw-text-${column.align}`,
            )}
          >
            {column.cellRenderer
              ? column.cellRenderer(row, column.id)
              : row[column.id]}
          </td>
        ),
      )}
      {showDetailsBelow && (
        <td
          className={classNames(
            'tw-hidden sm:tw-table-cell tw-text-right',
            showDetailsBelow !== true && `${showDetailsBelow}:tw-hidden`,
          )}
        >
          <button
            className="tw-relative tw-px-4 tw-py-4"
            onClick={onShowDetailsWrapped}
          >
            <img src={detailsIcon} alt="show details" />
          </button>
        </td>
      )}
    </tr>
  );

  return rowElement;
};
