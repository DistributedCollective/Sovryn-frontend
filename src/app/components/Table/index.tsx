import classNames from 'classnames';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styles from './index.module.scss';
import rowStyles from './components/TableRow/index.module.scss';
import { Dialog } from '../../containers/Dialog';
import { BreakpointOrder } from '../../../types';
import { ColumnOptions, RowObject } from './types';
import { TableRow } from './components/TableRow';

type TableProps<RowType extends RowObject> = {
  className?: string;
  columns: ColumnOptions<RowType>[];
  rows?: RowType[];
  rowKey?: (row: RowType) => number | string;
  noData?: ReactNode;
  showDetails?: boolean;
  detailsTitle?: string;
  detailsModal?: (props: { row?: RowType }) => ReactNode;
};

// No React.FC, since doesn't support Generic PropTypes
export const Table = <RowType extends RowObject>({
  className,
  columns,
  rows,
  rowKey,
  noData,
  showDetails,
  detailsTitle,
  detailsModal,
}: TableProps<RowType>) => {
  const { t } = useTranslation();
  const [openRow, setOpenRow] = useState<RowType>();
  const onShowDetails = useCallback(
    row => {
      if (showDetails) {
        setOpenRow(row);
      }
    },
    [showDetails],
  );
  const onHideDetails = useCallback(() => setOpenRow(undefined), []);

  const showDetailsBelow = useMemo(() => {
    if (showDetails) {
      const highestBreakpointIndex = columns.reduce(
        (acc, column) =>
          column.hideBelow === true
            ? Infinity
            : Math.max(
                acc,
                column.hideBelow
                  ? BreakpointOrder.indexOf(column.hideBelow)
                  : -1,
              ),
        -1,
      );

      return highestBreakpointIndex === Infinity
        ? true
        : BreakpointOrder[highestBreakpointIndex];
    }
  }, [showDetails, columns]);

  return (
    <div
      className={classNames(
        'tw-relative tw-flex tw-items-stretch tw-justify-items-stretch tw-rounded-lg tw-pt-2.5 tw-bg-gray-1',
        className,
      )}
    >
      <div className="tw-relative tw-flex-1 tw-overflow-auto">
        <table className="tw-w-full tw-min-w-auto tw-h-full tw-min-h-auto">
          <thead>
            <tr className={styles.headRow}>
              {columns.map(column =>
                column.hideBelow === true ? null : (
                  <th
                    key={column.id.toString()}
                    className={classNames(
                      'tw-sticky tw-top-0 tw-z-10 tw-px-4 tw-pb-2.5 tw-bg-gray-1',
                      column.hideBelow &&
                        `tw-hidden ${column.hideBelow}:tw-table-cell`,
                      column.align && `tw-text-${column.align}`,
                      column.className,
                    )}
                  >
                    {column.title}
                  </th>
                ),
              )}
              {showDetailsBelow && (
                <th
                  className={classNames(
                    'tw-sticky tw-top-0 tw-z-10 tw-w-16 tw-px-4 tw-pb-2.5 tw-bg-gray-1',
                    'tw-hidden sm:tw-table-cell',
                    showDetailsBelow !== true &&
                      `${showDetailsBelow}:tw-hidden`,
                  )}
                ></th>
              )}
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
                  showDetailsBelow={showDetailsBelow}
                  onShowDetails={onShowDetails}
                />
              ))
            ) : (
              <tr className={styles.row}>
                <td
                  className="tw-relative tw-px-4 tw-py-4 tw-text-center"
                  colSpan={999}
                >
                  {noData ? noData : t(translations.common.noData)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showDetails &&
        (detailsModal ? (
          detailsModal({ row: openRow })
        ) : (
          <Dialog isOpen={!!openRow} onClose={onHideDetails}>
            <div className="tw-px-12 sm:tw-px-16">
              <h2 className="tw-mb-6 tw-text-2xl tw-text-center tw-font-semibold ">
                {detailsTitle}
              </h2>
              <table className="tw-w-full">
                <tbody>
                  {openRow &&
                    columns.map(column => (
                      <tr key={column.id.toString()}>
                        <th className="tw-pr-5 tw-py-2.5 tw-font-normal tw-text-gray-8">
                          {column.title}
                        </th>
                        <td
                          className={classNames(
                            'tw-py-2.5 tw-font-medium tw-text-sov-white',
                            column.align && `tw-text-${column.align}`,
                          )}
                        >
                          {column.cellRenderer
                            ? column.cellRenderer(openRow, column.id)
                            : openRow[column.id]}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Dialog>
        ))}
    </div>
  );
};
