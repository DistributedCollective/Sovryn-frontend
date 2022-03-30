import React, { useMemo, useState } from 'react';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { LimitOrderRow } from '../LimitOrderRow';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Pagination } from 'app/components/Pagination';
import { MarginLimitOrderList } from '../LimitOrderTables';
import { EventData } from 'web3-eth-contract';

interface ILimitOrderHistoryProps {
  perPage?: number;
  orders: MarginLimitOrderList[];
  orderFilledEvents: EventData[];
  loading: boolean;
}

const trans = translations.spotTradingPage.openLimitOrders;

export const LimitOrderHistory: React.FC<ILimitOrderHistoryProps> = ({
  perPage = 5,
  orders,
  loading,
  orderFilledEvents,
}) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);

  const items = useMemo(
    () => orders.slice(page * perPage - perPage, page * perPage),
    [perPage, page, orders],
  );

  const isEmpty = !loading && !items.length;

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
            <th className="tw-hidden md:tw-table-cell">
              {t(trans.limitPrice)}
            </th>
            <th className="tw-hidden md:tw-table-cell">
              {t(trans.tradeAmount)}
            </th>
            <th className="tw-hidden sm:tw-table-cell">{t(trans.deadline)}</th>
            <th>{t(trans.filledAmount)}</th>
            <th>{t(trans.filledPrice)}</th>
          </tr>
        </thead>
        <tbody>
          {isEmpty && (
            <tr>
              <td colSpan={99} className="tw-text-center">
                {t(trans.noData)}
              </td>
            </tr>
          )}

          {loading && !items.length && (
            <tr>
              <td colSpan={99}>
                <SkeletonRow />
              </td>
            </tr>
          )}

          {items.length > 0 && (
            <>
              {items.map(item => (
                <LimitOrderRow
                  key={item.order.hash}
                  {...item}
                  orderFilledEvents={orderFilledEvents}
                />
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
