import { translations } from 'locales/i18n';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PerpetualPair } from 'utils/models/perpetual-pair';

type HeaderProps = {
  pair: PerpetualPair;
};

export const Header: React.FC<HeaderProps> = ({ pair }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="tw-px-1 tw-w-3/12">
        {t(translations.competitionPage.table.rank)}
      </div>
      <div className="tw-px-1 tw-w-7/12">
        {t(translations.competitionPage.table.name)}
      </div>
      <div className="tw-px-1 tw-w-2/12">
        {t(
          translations.competitionPage.leaderboard.tables.highestProfitTable
            .profit,
          { pair: pair.collateralAsset },
        )}
      </div>
    </>
  );
};
