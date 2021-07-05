import React from 'react';
// import { Container } from 'react-bootstrap';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

// import CurrencyContainer from './components/CurrencyContainer';
import './assets/index.scss';
// import CurrencyDetails from './components/CurrencyDetails';
// import LendingHistory from './components/LendingHistory';
import { Header } from 'app/components/Header';
import { lendBorrowSovrynSaga } from './saga';
import { reducer, sliceKey } from './slice';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectLendBorrowSovryn } from './selectors';
// import { TabType } from './types';
import { Footer } from '../../components/Footer';
// import { RepayPositionHandler } from '../RepayPositionHandler/Loadable';
// import { BorrowActivity } from '../../components/BorrowActivity/Loadable';
// import { WhitelistedNotification } from '../../components/WhitelistedNotification/Loadable';

type Props = {};

const LendBorrowSovryn: React.FC<Props> = props => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: lendBorrowSovrynSaga });

  // const state = useSelector(selectLendBorrowSovryn);
  // const dispatch = useDispatch();

  return (
    <>
      <Header />
      <main className="tw-container tw-mx-auto tw-mt-4 tw-px-4 tw-py-12">
        <div>
          {/* <div>
            <CurrencyContainer
              state={state.asset}
              setState={asset => dispatch(actions.changeAsset(asset))}
            />
          </div>
          <div className="tw-mt-4 lg:tw-mt-0">
            <CurrencyDetails />
          </div> */}
          <div className="tw-mw-320 tw-mx-auto">
            <h1 className="tw-mb-6 tw-text-white tw-text-center">
              Under Maintenance
            </h1>
            <div className="tw-text-sm tw-font-light tw-tracking-normal tw-text-center">
              Sorry, Lend page is undergoing maintenance.
            </div>
          </div>
        </div>
      </main>
      {/* <Container className="tw-mt-6">
        {state.tab === TabType.LEND && <LendingHistory />}
        {state.tab === TabType.BORROW && <BorrowActivity />}
        <RepayPositionHandler />
      </Container> */}
      <Footer />
    </>
  );
};

export default LendBorrowSovryn;
