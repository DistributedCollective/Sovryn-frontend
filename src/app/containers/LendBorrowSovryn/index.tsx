import React from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { Header } from 'app/components/Header';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { BorrowActivity } from '../../components/BorrowActivity/Loadable';
import { Footer } from '../../components/Footer';
import { RepayPositionHandler } from '../RepayPositionHandler/Loadable';
import CurrencyContainer from './components/CurrencyContainer';
import CurrencyDetails from './components/CurrencyDetails';
import LendingHistory from './components/LendingHistory';
import { lendBorrowSovrynSaga } from './saga';
import { selectLendBorrowSovryn } from './selectors';
import { actions, reducer, sliceKey } from './slice';
import { TabType } from './types';

import './assets/index.scss';

// import { WhitelistedNotification } from '../../components/WhitelistedNotification/Loadable';

type Props = {};

const LendBorrowSovryn: React.FC<Props> = props => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: lendBorrowSovrynSaga });

  const state = useSelector(selectLendBorrowSovryn);
  const dispatch = useDispatch();

  return (
    <>
      <Header />
      <main className="tw-container tw-mx-auto tw-mt-4 tw-px-4">
        <div className="tw-grid lg:tw-gap-8 tw-grid-cols-1 lg:tw-grid-cols-2">
          <div>
            <CurrencyContainer
              state={state.asset}
              setState={asset => dispatch(actions.changeAsset(asset))}
            />
          </div>
          <div className="tw-mt-4 lg:tw-mt-0">
            <CurrencyDetails />
          </div>
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
