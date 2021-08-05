import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

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
import { useHistory, useLocation } from 'react-router-dom';
import { IPromotionLinkState } from '../LandingPage/components/Promotions/components/PromotionCard/types';

const BorrowPage: React.FC = () => {
  const location = useLocation<IPromotionLinkState>();
  const history = useHistory<IPromotionLinkState>();
  const [linkAsset] = useState(location.state?.asset);

  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: lendBorrowSovrynSaga });

  const state = useSelector(selectLendBorrowSovryn);
  const dispatch = useDispatch();

  useEffect(() => linkAsset && history.replace(location.pathname), [
    history,
    linkAsset,
    location.pathname,
    location.state,
  ]);

  return (
    <>
      <Header />
      <main className="tw-container tw-mx-auto tw-mt-4 tw-px-4">
        <div className="tw-grid lg:tw-gap-8 tw-grid-cols-1 lg:tw-grid-cols-2">
          <div>
            <CurrencyContainer
              state={linkAsset || state.asset}
              setState={asset => dispatch(actions.changeAsset(asset))}
            />
          </div>
          <div className="tw-mt-4 lg:tw-mt-0">
            <CurrencyDetails />
          </div>
        </div>
      </main>
      <Container className="tw-mt-6">
        <BorrowActivity />
        <RepayPositionHandler />
      </Container>
      <Footer />
    </>
  );
};

export default BorrowPage;
