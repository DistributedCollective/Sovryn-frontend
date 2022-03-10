import React, { useMemo, useState } from 'react';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Pagination } from 'app/components/Pagination';
import { LimitOrderRow } from '../LimitOrderRow';
import { selectMarginTradePage } from 'app/pages/MarginTradePage/selectors';
import { useSelector } from 'react-redux';
import { MarginLimitOrderList, parseMarginOrder } from '../LimitOrderTables';

interface IOpenPositionsTableProps {
  perPage?: number;
  orders: MarginLimitOrderList[];
  loading: boolean;
}

export const OpenPositionsTable: React.FC<IOpenPositionsTableProps> = ({
  perPage = 5,
  orders,
  loading,
}) => {
  const { t } = useTranslation();
  const trans = translations.spotTradingPage.openLimitOrders;
  const { pendingLimitOrders } = useSelector(selectMarginTradePage);

  const [page, setPage] = useState(1);

  const items = useMemo(
    () => orders.slice(page * perPage - perPage, page * perPage),
    [perPage, page, orders],
  );
  const pendingList = useMemo(() => {
    return pendingLimitOrders
      .map(item => parseMarginOrder(item))
      .filter(
        item =>
          orders.findIndex(
            order =>
              order.createdTimestamp.getTime() ===
              item.createdTimestamp.getTime(),
          ) < 0,
      );
  }, [orders, pendingLimitOrders]);

  const isEmpty = !loading && !items.length && !pendingLimitOrders.length;

  const onPageChanged = data => {
    setPage(data.currentPage);
  };

  return (
    <>
      <table className="tw-table tw-table-auto">
        <thead>
          <tr>
            <th className="tw-hidden md:tw-table-cell">{t(trans.dateTime)}</th>
            <th className="tw-hidden xl:tw-table-cell">
              {t(translations.common.txHash)}
            </th>
            <th>{t(trans.pair)}</th>
            <th className="tw-hidden xl:tw-table-cell">
              {t(trans.limitPrice)}
            </th>
            <th className="tw-hidden md:tw-table-cell">
              {t(trans.tradeAmount)}
            </th>
            <th className="tw-hidden sm:tw-table-cell">{t(trans.deadline)}</th>
            <th>{t(trans.actions)}</th>
          </tr>
        </thead>
        <tbody>
          {isEmpty && (
            <tr>
              <td colSpan={99}>{t(trans.noData)}</td>
            </tr>
          )}

          {loading && !items.length && !pendingList.length && (
            <tr>
              <td colSpan={99}>
                <SkeletonRow />
              </td>
            </tr>
          )}

          {pendingList.length > 0 && (
            <>
              {pendingList.map(item => (
                <LimitOrderRow key={item.order.hash} {...item} pending={true} />
              ))}
            </>
          )}
          {items.length > 0 && (
            <>
              {items.map(item => (
                <LimitOrderRow key={item.order.hash} {...item} />
              ))}
            </>
          )}
        </tbody>
      </table>

      {orders.length > 0 && (
        <Pagination
          totalRecords={orders.length}
          pageLimit={perPage}
          pageNeighbours={1}
          onChange={onPageChanged}
        />
      )}
    </>
  );
};
