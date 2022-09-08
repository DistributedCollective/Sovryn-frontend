import { translations } from 'locales/i18n';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
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
      {/* This is here for later use 
      <div className="tw-px-1 tw-w-2/12">
    {t(translations.competitionPage.table.potentialPrize)}
  </div> */}
    </>
  );
};
