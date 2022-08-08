import React, { useRef } from 'react';
import classNames from 'classnames';

import { TraderRow } from './TraderRow';
import { useIntersection } from 'app/hooks/useIntersection';
import { RegisteredTraderData } from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import { useAccount } from 'app/hooks/useAccount';
import styles from './index.module.scss';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import { useGetData } from './hooks/useGetData';

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
  const { t } = useTranslation();
  const userRowRef = useRef<HTMLDivElement>(null);
  const userRowVisible = useIntersection(userRowRef.current);
  const account = useAccount();
  const { items, userData, loaded } = useGetData(pair, data);
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

  return (
    <>
      <div className="leaderboard-table">
        <div className="tw-flex tw-flex-row tw-items-end tw-text-xs tw-tracking-tighter tw-mb-3 tw-mr-8">
          <div className="tw-px-1 tw-w-1/12">
            {t(translations.competitionPage.table.rank)}
          </div>
          <div className="tw-px-1 tw-w-4/12">
            {t(translations.competitionPage.table.name)}
          </div>
          <div className="tw-px-1 tw-w-2/12">
            {t(translations.competitionPage.table.positions)}
          </div>
          <div className="tw-px-1 tw-w-3/12">
            {t(translations.competitionPage.table.trade)}
          </div>
          <div className="tw-px-1 tw-w-2/12">
            {t(translations.competitionPage.table.total)}
          </div>
          {/* <div className="tw-px-1 tw-w-2/12">
            {t(translations.competitionPage.table.potentialPrize)}
          </div> */}
        </div>
        <div
          className={classNames(
            'tw-scrollbars-thin tw-overflow-y-auto tw-text-sm tw-align-middle',
            styles.leaderboardContainer,
          )}
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
          {(!data || (!loaded && !items?.length)) && <SkeletonRow />}
          {loaded && items && items.length === 0 && (
            <div className="tw-flex tw-flex-row tw-justify-center tw-py-5 tw-mb-2 tw-mr-4 tw-font-thin tw-bg-gray-3 tw-rounded tw-border tw-border-transparent">
              {t(translations.competitionPage.table.empty)}
            </div>
          )}
        </div>
        <div
          className={classNames('tw-my-2 tw-h-16', {
            'tw-hidden': !showUserRow || !userData,
          })}
        >
          <div className={classNames({ 'tw-hidden': userRowVisible })}>
            <div className="tw-mb-2 tw-ml-4">...</div>
            <div className="tw-mr-4 tw-text-sm tw-align-middle">
              {userData && (
                <TraderRow
                  data={userData}
                  isUser
                  // potentialPrize={
                  //   ['1', '2', '3'].includes(userData.rank)
                  //     ? potentialPrizes[Number(userData.rank) - 1]
                  //     : 0
                  // }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// const calculatePotentialPrizes = (
//   traders: LeaderboardData[],
//   ammProfit: number,
// ): number[] => {
//   const firstTraderPnl =
//     traders.find(trader => trader.rank === '1')?.totalPnL || 0;
//   const secondTraderPnl =
//     traders.find(trader => trader.rank === '2')?.totalPnL || 0;
//   const thirdTraderPnl =
//     traders.find(trader => trader.rank === '3')?.totalPnL || 0;
//   const totalTradersPnl = firstTraderPnl + secondTraderPnl + thirdTraderPnl;

//   return [
//     (firstTraderPnl / totalTradersPnl) * ammProfit,
//     (secondTraderPnl / totalTradersPnl) * ammProfit,
//     (thirdTraderPnl / totalTradersPnl) * ammProfit,
//   ];
// };
