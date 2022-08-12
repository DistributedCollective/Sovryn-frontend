import { useAccount } from 'app/hooks/useAccount';
import { useIntersection } from 'app/hooks/useIntersection';
import React, { useMemo, useRef } from 'react';
import { RegisteredTraderData } from '../../../../types';
import { TraderRow } from './components/TraderRow';
import { useGetData } from './hooks/useGetData';
import { Table } from '../Table';
import { Header } from './components/Header';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { LAST_RESET_OF_RANKING } from '../../utils';

type HighestProfitTableProps = {
  data: RegisteredTraderData[];
  showUserRow: boolean;
  pair: PerpetualPair;
};

export const HighestProfitTable: React.FC<HighestProfitTableProps> = ({
  data,
  showUserRow,
  pair,
}) => {
  const userRowRef = useRef<HTMLDivElement>(null);
  const userRowVisible = useIntersection(userRowRef.current);
  const account = useAccount();
  const { t } = useTranslation();

  const { items, userData, loaded } = useGetData(data);

  const isLoading = useMemo(() => !data || (!loaded && !items?.length), [
    data,
    items?.length,
    loaded,
  ]);
  const isEmpty = useMemo(() => loaded && items && items.length === 0, [
    items,
    loaded,
  ]);
  const isHidden = useMemo(() => !showUserRow || !userData, [
    showUserRow,
    userData,
  ]);

  return (
    <>
      <div className="tw-text-xs tw-font-medium tw-mb-6 tw-ml-1">
        {t(translations.competitionPage.lastResetOfRanking, {
          date: LAST_RESET_OF_RANKING,
        })}
      </div>

      <Table
        header={<Header pair={pair} />}
        isLoading={isLoading}
        isEmpty={isEmpty}
        isHidden={isHidden}
        userRowVisible={userRowVisible}
        scrollRow={userData && <TraderRow data={userData} isUser />}
      >
        {items.map(val => {
          const isUser = val.walletAddress === account?.toLowerCase();
          return (
            <TraderRow
              ref={isUser ? userRowRef : null}
              data={val}
              key={val.walletAddress}
              isUser={isUser}
            />
          );
        })}
      </Table>
    </>
  );
};
