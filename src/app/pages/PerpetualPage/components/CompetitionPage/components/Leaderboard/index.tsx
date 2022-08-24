import { Tabs } from 'app/components/Tabs';
import { translations } from 'locales/i18n';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import { RegisteredTraderData } from '../../types';
import { BestReturnTable } from './components/BestReturnTable';
import { HighestProfitTable } from './components/HighestProfitTable';
import { HighestVolumeTable } from './components/HighestVolumeTable';
import { MostTradesTable } from './components/MostTradesTable';

type LeaderboardProps = {
  data: RegisteredTraderData[];
  showUserRow: boolean;
  pair: PerpetualPair;
};

export const Leaderboard: React.FC<LeaderboardProps> = ({
  data,
  showUserRow,
  pair,
}) => {
  const { t } = useTranslation();
  const tabs = useMemo(
    () => [
      {
        id: 'bestReturn',
        label: t(translations.competitionPage.leaderboard.tabs.bestReturn),
        content: (
          <BestReturnTable data={data} showUserRow={showUserRow} pair={pair} />
        ),
      },
      {
        id: 'highestVolume',
        label: t(translations.competitionPage.leaderboard.tabs.highestVolume),
        content: (
          <HighestVolumeTable
            data={data}
            showUserRow={showUserRow}
            pair={pair}
          />
        ),
      },
      {
        id: 'mostTrades',
        label: t(translations.competitionPage.leaderboard.tabs.mostTrades),
        content: <MostTradesTable data={data} showUserRow={showUserRow} />,
      },
      {
        id: 'highestProfit',
        label: t(translations.competitionPage.leaderboard.tabs.highestProfit),
        content: (
          <HighestProfitTable
            data={data}
            showUserRow={showUserRow}
            pair={pair}
          />
        ),
      },
    ],
    [data, pair, showUserRow, t],
  );

  return (
    <div>
      <Tabs
        items={tabs}
        initial={tabs[0].id}
        dataActionId="perpetuals-ranking"
        contentClassName="tw-mt-3 tw-ml-2"
      />
    </div>
  );
};
