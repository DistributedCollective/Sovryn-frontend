import { useAccount } from 'app/hooks/useAccount';
import { useIntersection } from 'app/hooks/useIntersection';
import { translations } from 'locales/i18n';
import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RegisteredTraderData } from '../../../../types';
import { LAST_RESET_OF_RANKING } from '../../utils';
import { Table } from '../Table';
import { Header } from './components/Header';
import { TraderRow } from './components/TraderRow';
import { useGetData } from './hooks/useGetData';

type MostTradesTableProps = {
  data: RegisteredTraderData[];
  showUserRow: boolean;
};

export const MostTradesTable: React.FC<MostTradesTableProps> = ({
  data,
  showUserRow,
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
      <div className="tw-text-xs tw-font-medium tw-mb-6">
        {t(translations.competitionPage.lastResetOfRanking, {
          date: LAST_RESET_OF_RANKING,
        })}
      </div>
      <Table
        header={<Header />}
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
