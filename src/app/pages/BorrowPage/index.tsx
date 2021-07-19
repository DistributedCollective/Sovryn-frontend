import React from 'react';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import CurrencyContainer from './components/CurrencyContainer';
import './assets/index.scss';
import CurrencyDetails from './components/CurrencyDetails';
import { Header } from 'app/components/Header';
import { lendBorrowSovrynSaga } from './saga';
import { actions, reducer, sliceKey } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectLendBorrowSovryn } from './selectors';
import { Footer } from '../../components/Footer';
import { RepayPositionHandler } from 'app/containers/RepayPositionHandler/Loadable';
import { BorrowActivity } from '../../components/BorrowActivity/Loadable';

type Props = {};

const BorrowPage: React.FC<Props> = props => {
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
      <div className="tw-container tw-mx-auto tw-px-4 tw-mt-6">
        <BorrowActivity />
        <RepayPositionHandler />
      </div>
      <Footer />
    </>
  );
};

export default BorrowPage;
