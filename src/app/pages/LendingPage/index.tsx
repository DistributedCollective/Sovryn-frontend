import React from 'react';

import CurrencyContainer from './components/CurrencyContainer';
import './assets/index.scss';
import { Header } from 'app/components/Header';
import { Footer } from '../../components/Footer';
import { LootDropSectionWrapper } from 'app/components/FinanceV2Components/LootDrop/LootDropSectionWrapper';
import { LootDrop } from 'app/components/FinanceV2Components/LootDrop';
import { LootDropColors } from 'app/components/FinanceV2Components/LootDrop/styled';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { useTranslation } from 'react-i18next';

type Props = {};

const LendBorrowSovryn: React.FC<Props> = props => {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main className="tw-container tw-mx-auto tw-px-4">
        <LootDropSectionWrapper>
          <LootDrop
            title="75K SOV Loot Drop"
            asset1={Asset.SOV}
            asset2={Asset.RBTC}
            startDate="24/05/21"
            endDate="30/05/21"
            linkUrl="https://www.sovryn.app/blog/prepare-yourself-for-the-awakening"
            linkText={t(translations.liquidityMining.lootDropLink)}
            highlightColor={LootDropColors.Purple}
          />
        </LootDropSectionWrapper>

        <div className="tw-full">
          <CurrencyContainer />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default LendBorrowSovryn;
