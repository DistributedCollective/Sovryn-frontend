/**
 *
 * SalesPage
 *
 */

import React, { useEffect } from 'react';
import 'styles/sass/_genesis-sale.scss';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { translations } from '../../../locales/i18n';
import { Header } from '../../components/Header';
import { useAccount, useIsConnected } from '../../hooks/useAccount';

import PageHeader from '../../components/PageHeader';

import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';

import { AboutSOV, SOVModel, SOVGovernance } from './Information';

import Screen1 from './screen1';
import Screen2 from './screen2';
import Screen3 from './screen3';
import Screen4 from './screen4';
import Screen5 from './screen5';
import Screen6 from './screen6';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
  actions,
  sliceKey as salesSlice,
  reducer as salesReducer,
} from './slice';
import { selectSalesPage } from './selectors';
import { SaleInfoBar } from './SaleInfoBar';
import { salesPageSaga } from './saga';
import { AddSoToNifty } from './AddSoToNifty';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { currentNetwork } from '../../../utils/classifiers';
import EnterCodeLanding from './EnterCodeLanding';

export function SalesPage() {
  useInjectReducer({ key: salesSlice, reducer: salesReducer });
  useInjectSaga({ key: salesSlice, saga: salesPageSaga });

  const { t } = useTranslation();
  const isConnected = useIsConnected();
  const account = useAccount();
  const dispatch = useDispatch();

  const { value: maxPurchase } = useCacheCallWithValue(
    'CrowdSale',
    'getMaxPurchase',
    '0',
    account,
  );

  const { value: totalDeposits } = useCacheCallWithValue(
    'CrowdSale',
    'InvestorTotalDeposits',
    '0',
    account,
  );

  const { value: minPurchase } = useCacheCallWithValue(
    'CrowdSale',
    'minPurchase',
    '0',
  );

  const state = useSelector(selectSalesPage);

  useEffect(() => {
    dispatch(actions.updateMaxDeposit(maxPurchase));
  }, [maxPurchase, dispatch]);

  useEffect(() => {
    dispatch(actions.updateMinDeposit(minPurchase));
  }, [minPurchase, dispatch]);

  useEffect(() => {
    dispatch(actions.updateTotalDeposits(totalDeposits));
  }, [totalDeposits, dispatch]);

  useEffect(() => {
    if (isConnected) dispatch(actions.changeStep(2));
    else dispatch(actions.changeStep(1));
  }, [isConnected, dispatch]);

  useEffect(() => {
    document.body.classList.add('genesis-sale-page');
    return () => {
      document.body.classList.remove('genesis-sale-page');
    };
  }, []);

  return (
    <div>
      <Helmet>
        <title>{t(translations.salesPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.salesPage.meta.description)}
        />
      </Helmet>
      <Header />
      <main
        className="container font-family-montserrat"
        style={{ maxWidth: '1730px', letterSpacing: 'normal' }}
      >
        <PageHeader />

        <SaleInfoBar />

        {currentNetwork === 'testnet' && (
          <div className="container mt-5 mb-4" style={{ maxWidth: '1200px' }}>
            <div className="bg-info sovryn-border rounded p-3 d-flex flex-row justify-content-start align-items-center">
              <div className="ml-3 mr-4">
                <Icon icon="warning-sign" iconSize={26} />
              </div>
              <div>
                This is testnet, not the actual sale. Do not send real funds!
              </div>
            </div>
          </div>
        )}

        {currentNetwork === 'testnet' && (
          <>
            {!isConnected ? (
              <Screen1 />
            ) : (
              <>
                {Number(state.maxDeposit) === 0 ? (
                  <EnterCodeLanding />
                ) : (
                  <>
                    {state.step === 1 && <Screen1 />}
                    {state.step === 2 && <Screen2 />}
                    {state.step === 3 && <Screen3 />}
                    {state.step === 4 && <Screen4 />}
                    {state.step === 5 && <Screen5 />}
                    {state.step === 6 && <Screen6 />}
                  </>
                )}
              </>
            )}
          </>
        )}
        <AboutSOV />
        <SOVModel />
        <SOVGovernance />
        {/*<div className="footer d-flex justify-content-center mb-5">
          <SalesButton text="Read Whitepaper" onClick={() => {}} />
            </div>*/}
      </main>
      <AddSoToNifty />
    </div>
  );
}
