import React from 'react';
import { Container } from 'react-bootstrap';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import CurrencyContainer from './components/CurrencyContainer';
import './assets/index.scss';
import CurrencyDetails from './components/CurrencyDetails';
import LendingHistory from './components/LendingHistory';
import { Header } from 'app/components/Header';
import { lendBorrowSovrynSaga } from './saga';
import { actions, reducer, sliceKey } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectLendBorrowSovryn } from './selectors';
import { TabType } from './types';
import { Footer } from '../../components/Footer';
import { RepayPositionHandler } from '../RepayPositionHandler/Loadable';
import { BorrowActivity } from '../../components/BorrowActivity/Loadable';
import { LootDropSectionWrapper } from 'app/components/FinanceV2Components/LootDrop/LootDropSectionWrapper';
import { LootDrop } from 'app/components/FinanceV2Components/LootDrop';
import { LootDropColors } from 'app/components/FinanceV2Components/LootDrop/styled';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { useTranslation } from 'react-i18next';
// import { WhitelistedNotification } from '../../components/WhitelistedNotification/Loadable';

type Props = {};

const LendBorrowSovryn: React.FC<Props> = props => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: lendBorrowSovrynSaga });

  const state = useSelector(selectLendBorrowSovryn);
  const dispatch = useDispatch();

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
          <CurrencyContainer
            state={state.asset}
            setState={asset => dispatch(actions.changeAsset(asset))}
          />
        </div>
        <div className="tw-mt-4 lg:tw-mt-0">
          <CurrencyDetails />
        </div>
      </main>

      <Container className="tw-mt-6">
        {state.tab === TabType.LEND && <LendingHistory />}
        {state.tab === TabType.BORROW && <BorrowActivity />}
        <RepayPositionHandler />
      </Container>
      <Footer />
    </>
  );
};

export default LendBorrowSovryn;
