import React from 'react';

import CurrencyContainer from './components/CurrencyContainer';
import { Header } from 'app/components/Header';
import { Footer } from '../../components/Footer';
import { LootDropSectionWrapper } from 'app/components/FinanceV2Components/LootDrop/LootDropSectionWrapper';
import { LootDrop } from 'app/components/FinanceV2Components/LootDrop';
import { LootDropColors } from 'app/components/FinanceV2Components/LootDrop/styled';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { HistoryTable } from './components/HistoryTable';
import { Asset } from 'types';

const LendingPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t(translations.lendingPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.lendingPage.meta.description)}
        />
      </Helmet>
      <Header />
      <div className="container mt-5 font-family-montserrat">
        <LootDropSectionWrapper>
          <LootDrop
            title="15K SOV"
            asset1={Asset.XUSD}
            message={t(translations.liquidityMining.recalibration, {
              date: 'July 26',
            })}
            linkUrl="https://wiki.sovryn.app/en/sovryn-dapp/lending#sov-loot-drops-on-lending-pools"
            linkText={t(translations.liquidityMining.lootDropLink)}
            highlightColor={LootDropColors.Yellow}
          />
        </LootDropSectionWrapper>

        <div className={'tw-max-w-screen-2xl tw-mx-auto tw-mt-5'}>
          <CurrencyContainer />
        </div>

        <div className="tw-mt-12">
          <div className="tw-px-3 tw-text-lg">
            {t(translations.lendingPage.historyTable.title)}
          </div>
          <HistoryTable />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LendingPage;
