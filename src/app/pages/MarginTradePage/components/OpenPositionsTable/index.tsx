import React from 'react';
import { useGetActiveLoans } from 'app/hooks/trading/useGetActiveLoans';
import { useAccount } from 'app/hooks/useAccount';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { OpenPositionRow } from './OpenPositionRow';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';

interface Props {
  perPage: number;
}

export function OpenPositionsTable(props: Props) {
  const { t } = useTranslation();
  // const [page, setPage] = useState(1);
  // const from = useMemo(() => (page - 1) * props.perPage, [props.perPage, page]);

  const { value, loading } = useGetActiveLoans(
    useAccount(),
    // from,
    // props.perPage,
    0,
    1000,
    1,
    false,
    false,
  );

  const isEmpty = !loading && !value.length;

  return (
    <>
      <table className="tw-table">
        <thead>
          <tr>
            <th className="tw-w-full">
              {t(translations.openPositionTable.direction)}
            </th>
            <th className="tw-w-full">
              {t(translations.openPositionTable.positionSize)}
            </th>
            <th className="tw-w-full tw-hidden xl:tw-table-cell">
              {t(translations.openPositionTable.entryPrice)}
            </th>
            <th className="tw-w-full tw-hidden xl:tw-table-cell">
              {t(translations.openPositionTable.liquidationPrice)}
            </th>
            <th className="tw-w-full tw-hidden xl:tw-table-cell">
              {t(translations.openPositionTable.positionMargin)}
            </th>
            <th className="tw-w-full">
              {t(translations.openPositionTable.unrealizedPL)}
            </th>
            <th className="tw-w-full tw-hidden xl:tw-table-cell">
              {t(translations.openPositionTable.interestAPR)}
            </th>
            <th className="tw-w-full">
              {t(translations.openPositionTable.actions)}
            </th>
          </tr>
        </thead>
        <tbody>
          {isEmpty && (
            <tr>
              <td colSpan={99}>{t(translations.openPositionTable.noData)}</td>
            </tr>
          )}

          {loading && (
            <tr>
              <td colSpan={99}>
                <SkeletonRow />
              </td>
            </tr>
          )}

          {value.length > 0 && (
            <>
              {value.map(item => (
                <OpenPositionRow key={item.loanId} item={item} />
              ))}
            </>
          )}
        </tbody>
      </table>
      {/*<Pagination*/}
      {/*  totalRecords={1000}*/}
      {/*  pageLimit={props.perPage}*/}
      {/*  pageNeighbours={1}*/}
      {/*  onChange={({ currentPage }) => setPage(currentPage)}*/}
      {/*/>*/}
    </>
  );
}

OpenPositionsTable.defaultProps = {
  perPage: 20,
};
