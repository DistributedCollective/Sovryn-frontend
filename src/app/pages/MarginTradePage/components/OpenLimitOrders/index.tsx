import React, { useMemo, useState } from 'react';
import { useAccount } from 'app/hooks/useAccount';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { OpenPositionRow } from './OpenPositionRow';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { Pagination } from '../../../../components/Pagination';
import { useGetLimitOrders } from 'app/hooks/limitOrder/useGetLimitOrders';

interface IOpenLimitOrdersProps {
  perPage: number;
}

export function OpenLimitOrders({ perPage }: IOpenLimitOrdersProps) {
  const { t } = useTranslation();
  const trans = translations.spotTradingPage.openLimitOrders;
  const account = useAccount();

  const [page, setPage] = useState(1);

  const { value, loading } = useGetLimitOrders(account);

  const items = useMemo(
    () => value.slice(page * perPage - perPage, page * perPage),
    [perPage, page, value],
  );

  const isEmpty = !loading && !items.length;

  const onPageChanged = data => {
    setPage(data.currentPage);
  };

  return (
    <>
      <table className="tw-table">
        <thead>
          <tr>
            <th className="tw-w-full">{t(trans.dateTime)}</th>
            <th className="tw-w-full">{t(trans.pair)}</th>
            <th className="tw-w-full">{t(trans.orderType)}</th>
            <th className="tw-w-full">{t(trans.tradeAmount)}</th>
            <th className="tw-w-full">{t(trans.limitPrice)}</th>
            <th className="tw-w-full">{t(trans.amountReceive)}</th>
            <th className="tw-w-full">{t(trans.deadline)}</th>
            <th className="tw-w-full">{t(trans.actions)}</th>
          </tr>
        </thead>
        <tbody>
          {isEmpty && (
            <tr>
              <td colSpan={99}>{t(trans.noData)}</td>
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
                <OpenPositionRow key={item.hash} item={item} />
              ))}
            </>
          )}
        </tbody>
      </table>

      {value.length > 0 && (
        <Pagination
          totalRecords={value.length}
          pageLimit={perPage}
          pageNeighbours={1}
          onChange={onPageChanged}
        />
      )}
    </>
  );
}

OpenLimitOrders.defaultProps = {
  perPage: 5,
};
