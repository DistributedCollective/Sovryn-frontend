import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import CurrencyContainer from './components/CurrencyContainer';
import CurrencyDetails from './components/CurrencyDetails';
import { lendBorrowSovrynSaga } from './saga';
import { actions, reducer, sliceKey } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectLendBorrowSovryn } from './selectors';
import { RepayPositionHandler } from 'app/containers/RepayPositionHandler/Loadable';
import { BorrowActivity } from '../../components/BorrowActivity/Loadable';
import { useHistory, useLocation } from 'react-router-dom';
import { IPromotionLinkState } from '../LandingPage/components/Promotions/components/PromotionCard/types';

const BorrowPage: React.FC = () => {
  const location = useLocation<IPromotionLinkState>();
  const history = useHistory<IPromotionLinkState>();
  const [linkAsset] = useState(location.state?.asset);

  const { t } = useTranslation();
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
      <Helmet>
        <title>{t(translations.borrow.meta.title)}</title>
      </Helmet>
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
      <div className="tw-container tw-mx-auto tw-px-4 tw-mt-6">
        <BorrowActivity />
        <RepayPositionHandler />
      </div>
    </>
  );
};

export default BorrowPage;
