import React, { useMemo, useRef } from 'react';
import { TraderRow } from './components/TraderRow';
import { useIntersection } from 'app/hooks/useIntersection';
import { RegisteredTraderData } from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import { useAccount } from 'app/hooks/useAccount';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import { useGetData } from './hooks/useGetData';
import { Table } from '../Table';
import { Header } from './components/Header';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface IBestReturnTableProps {
  data: RegisteredTraderData[];
  showUserRow: boolean;
  pair: PerpetualPair;
}

export const BestReturnTable: React.FC<IBestReturnTableProps> = ({
  data,
  showUserRow,
  pair,
}) => {
  const userRowRef = useRef<HTMLDivElement>(null);
  const userRowVisible = useIntersection(userRowRef.current);
  const account = useAccount();
  const { items, userData, loaded } = useGetData(pair, data);
  const { t } = useTranslation();
  // const [potentialPrizes, setPotentialPrizes] = useState([0, 0, 0]);

  // const {
  //   result: ammProfit,
  //   refetch: ammProfitRefetch,
  // } = usePerpetual_getAmmCompetitionProfit();

  // useEffect(() => {
  //   setPotentialPrizes(calculatePotentialPrizes(items, ammProfit));
  // }, [ammProfit, items]);

  // useEffect(() => {
  //   ammProfitRefetch();
  // }, [account, data, leaderboardData, ammProfitRefetch]);

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
        {t(translations.competitionPage.allTimeRanking)}
      </div>
      <Table
        header={<Header />}
        isLoading={isLoading}
        isEmpty={isEmpty}
        isHidden={isHidden}
        userRowVisible={userRowVisible}
        scrollRow={
          userData && (
            <TraderRow
              data={userData}
              isUser
              // potentialPrize={
              //   ['1', '2', '3'].includes(userData.rank)
              //     ? potentialPrizes[Number(userData.rank) - 1]
              //     : 0
              // }
            />
          )
        }
      >
        {items.map(val => {
          const isUser = val.walletAddress === account?.toLowerCase();
          return (
            <TraderRow
              ref={isUser ? userRowRef : null}
              data={val}
              key={val.walletAddress}
              isUser={isUser}
              // potentialPrize={
              //   ['1', '2', '3'].includes(val.rank)
              //     ? potentialPrizes[Number(val.rank) - 1]
              //     : 0
              // }
            />
          );
        })}
      </Table>
    </>
  );
};
