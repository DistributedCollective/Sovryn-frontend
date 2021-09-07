import classNames from 'classnames';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import detailsIcon from 'assets/images/ellipsis-h.svg';
import styles from './index.module.scss';
import { Dialog } from '../../containers/Dialog';
import { isChecked } from '../../../utils/helpers';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'any';
const BREAKPOINTS_ORDER: Breakpoint[] = [
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  'any',
];

type RowObject = { [param: string]: any };

type ColumnOptions<RowType extends RowObject> = {
  id: keyof RowType | string;
  title?: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  hideBelow?: null | Breakpoint;
  cellRenderer?: (
    row: RowType,
    columnId: ColumnOptions<RowType>['id'],
  ) => ReactNode;
};

type ITableProps<RowType extends RowObject> = {
  className?: string;
  columns: ColumnOptions<RowType>[];
  rows?: RowType[];
  rowKey?: (row: RowType) => number | string;
  noData?: ReactNode;
  showDetails?: boolean;
  detailsTitle?: string;
  detailsModal?: (props: { row?: RowType }) => ReactNode;
};

// No React.FC, since it doesn't work with Generic PropType
export const Table = <RowType extends RowObject>({
  className,
  columns,
  rows,
  rowKey,
  noData,
  showDetails,
  detailsTitle,
  detailsModal,
}: ITableProps<RowType>) => {
  const { t } = useTranslation();
  const [openRow, setOpenRow] = useState<RowType>();
  const onShowDetails = useCallback(row => showDetails && setOpenRow(row), [
    showDetails,
  ]);
  const onHideDetails = useCallback(() => setOpenRow(undefined), []);

  const showDetailsBelow = useMemo(() => {
    if (showDetails) {
      const highestBreakpointIndex = columns.reduce(
        (acc, column) =>
          Math.max(
            acc,
            column.hideBelow ? BREAKPOINTS_ORDER.indexOf(column.hideBelow) : -1,
          ),
        -1,
      );

      return BREAKPOINTS_ORDER[highestBreakpointIndex];
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
                column.hideBelow === 'any' ? null : (
                  <th
                    key={column.id.toString()}
                    className={classNames(
                      'tw-sticky tw-top-0 tw-z-10 tw-px-4 tw-pb-2.5 tw-bg-gray-1',
                      column.hideBelow &&
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
                    showDetailsBelow !== 'any' &&
                      `${showDetailsBelow}:tw-hidden ${showDetailsBelow}:tw-hidden`,
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
                      <tr>
                        <th
                          key={column.id.toString()}
                          className="tw-pr-5 tw-py-2.5 tw-font-normal tw-text-gray-8"
                        >
                          {column.title}
                        </th>
                        <td
                          key={column.id.toString()}
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

type ITableRowProps<RowType extends RowObject> = {
  columns: ITableProps<RowType>['columns'];
  row: RowType;
  index: number;
  showDetailsBelow?: Breakpoint;
  onShowDetails?: (row: RowType) => void;
};

const TableRow = <RowType extends RowObject>({
  columns,
  row,
  index,
  showDetailsBelow,
  onShowDetails,
}: ITableRowProps<RowType>) => {
  const onShowDetailsWrapped = useCallback(() => onShowDetails?.(row), [
    onShowDetails,
    row,
  ]);

  const onRowClick = useCallback(
    (event: React.MouseEvent) => {
      if (showDetailsBelow && window.innerWidth < 576) {
        onShowDetailsWrapped();
      }
    },
    [showDetailsBelow, onShowDetailsWrapped],
  );

  const rowElement = (
    <tr className={classNames(styles.row)} onClick={onRowClick}>
      {columns.map(column =>
        column.hideBelow === 'any' ? null : (
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
            showDetailsBelow !== 'any' &&
              `${showDetailsBelow}:tw-hidden ${showDetailsBelow}:tw-hidden`,
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
