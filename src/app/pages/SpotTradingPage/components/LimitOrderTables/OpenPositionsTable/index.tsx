import React, { useMemo, useState } from 'react';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { LimitOrderRow } from '../LimitOrderRow';
import { useTranslation, Trans } from 'react-i18next';

import { ILimitOrder } from 'app/pages/SpotTradingPage/types';
import { translations } from 'locales/i18n';
import { useSelector } from 'react-redux';
import { selectSpotTradingPage } from '../../../selectors';
import { Pagination } from 'app/components/Pagination';
import { HelpBadge } from 'app/components/HelpBadge/HelpBadge';
import { LimitOrderCreatedFragment } from 'utils/graphql/rsk/generated';

interface IOpenPositionsTableProps {
  perPage?: number;
  orders: ILimitOrder[];
  loading: boolean;
  orderCreatedEvents?: LimitOrderCreatedFragment[];
}

export const OpenPositionsTable: React.FC<IOpenPositionsTableProps> = ({
  perPage = 5,
  orders,
  loading,
  orderCreatedEvents,
}) => {
  const { t } = useTranslation();
  const trans = translations.spotTradingPage.openLimitOrders;
  const { pendingLimitOrders } = useSelector(selectSpotTradingPage);

  const [page, setPage] = useState(1);

  const items = useMemo(
    () => orders.slice(page * perPage - perPage, page * perPage),
    [perPage, page, orders],
  );
  const pendingList = useMemo(() => {
    return pendingLimitOrders
      .filter(
        item =>
          orders.findIndex(
            order => order.created.toString() === item.created.toString(),
          ) < 0,
      )
      .map(item => ({ ...item, transactionHash: item.hash }));
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
            <th className="tw-hidden xl:tw-table-cell">{t(trans.dateTime)}</th>
            <th className="tw-hidden xl:tw-table-cell">
              {t(translations.common.txHash)}
            </th>
            <th>{t(trans.pair)}</th>
            <th className="tw-hidden md:tw-table-cell">{t(trans.orderType)}</th>
            <th>{t(trans.tradeAmount)}</th>
            <th className="tw-hidden md:tw-table-cell">
              <HelpBadge
                tooltip={
                  <Trans
                    i18nKey={
                      translations.spotTradingPage.openLimitOrders
                        .limitPriceHelper
                    }
                    components={[
                      <a
                        target="_blank"
                        href="https://wiki.sovryn.app/en/sovryn-dapp/limit-order-limitations#limit-order-execution"
                        rel="noopener noreferrer"
                      >
                        x
                      </a>,
                    ]}
                  />
                }
              >
                {t(trans.limitPrice)}
              </HelpBadge>
            </th>
            <th className="tw-hidden lg:tw-table-cell">
              {t(trans.amountReceive)}
            </th>
            <th className="tw-hidden sm:tw-table-cell">{t(trans.deadline)}</th>
            <th>{t(trans.actions)}</th>
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
                <LimitOrderRow
                  key={item.transactionHash}
                  item={item}
                  pending={true}
                />
              ))}
            </>
          )}
          {items.length > 0 && (
            <>
              {items.map(item => (
                <LimitOrderRow
                  key={item.transactionHash}
                  item={item}
                  orderCreatedEvents={orderCreatedEvents}
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
