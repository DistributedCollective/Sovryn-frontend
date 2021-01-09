/**
 *
 * SalesPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { Header } from '../../components/Header';
import styled from 'styled-components';
import { useAccount, useIsConnected } from '../../hooks/useAccount';

import PageHeader from '../../components/PageHeader';

import SalesButton from '../../components/SalesButton';

import { TutorialSOVModal } from '../TutorialSOVModal/Loadable';
import { useSelector, useDispatch } from 'react-redux';
import { actions as fActions } from '../../containers/FastBtcForm/slice';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';

import { AboutSOV, SOVModel, SOVGovernance } from './Information';

import Screen1 from './screen1';
import Screen2 from './screen2';
import Screen3 from './screen3';
import Screen4 from './screen4';
import Screen5 from './screen5';
import Screen6 from './screen6';

import { useInjectReducer } from 'utils/redux-injectors';
import {
  actions,
  sliceKey as salesSlice,
  reducer as salesReducer,
} from './slice';
import { selectSalesPage } from './selectors';

const InfoBar = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #d9d9d9;
  padding-top: 20px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 20px;
  max-width: 1520px;
  margin-left: auto;
  margin-right: auto;
  p:last-child {
    font-size: 20px;
    margin-bottom: 0;
  }
`;

export function SalesPage() {
  useInjectReducer({ key: salesSlice, reducer: salesReducer });

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
  const state = useSelector(selectSalesPage);

  useEffect(() => {
    dispatch(actions.updateMaxDeposit(maxPurchase));
  }, [maxPurchase, dispatch]);

  useEffect(() => {
    if (isConnected && account) {
      dispatch(fActions.changeReceiverAddress(account));
    }
  }, [account, isConnected, dispatch]);

  useEffect(() => {
    if (isConnected) dispatch(actions.changeStep(2));
    else dispatch(actions.changeStep(1));
  }, [isConnected, dispatch]);

  return (
    <>
      <Helmet>
        <title>{t(translations.salesPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.salesPage.meta.description)}
        />
      </Helmet>

      <TutorialSOVModal />
      <Header />
      <div
        className="container font-family-montserrat"
        style={{ maxWidth: '1700px', letterSpacing: 'normal' }}
      >
        <PageHeader />
        <InfoBar>
          <div>
            <p>Total Supply:</p>
            <p>21,000,000 SOV</p>
          </div>
          <div>
            <p>Sales Allocation:</p>
            <p>1,333,333 SOV</p>
          </div>
          <div>
            <p>Allocation Remaining:</p>
            <p>25% ≈ 333,333 SOV*</p>
          </div>
          <div>
            <p>Price:</p>
            <p>$0.75/SOV</p>
          </div>
          <div>
            <p>Vesting:</p>
            <p>6 Months</p>
          </div>
          <div>
            <p>Accepted currencies:</p>
            <p>BTC, RBTC</p>
          </div>
          <div>
            <p>Token Sale End Time :</p>
            <p>16.00 CET, 8th Jan</p>
          </div>
        </InfoBar>
        {state.step === 1 && <Screen1 />}
        {state.step === 2 && <Screen2 />}
        {state.step === 3 && <Screen3 />}
        {state.step === 4 && <Screen4 />}
        {state.step === 5 && <Screen5 />}
        {state.step === 6 && <Screen6 />}

        <AboutSOV />
        <SOVModel />
        <SOVGovernance />
        <div className="footer d-flex justify-content-center mb-5">
          <SalesButton text="Read Our Whitepaper" onClick={() => {}} />
        </div>
      </div>
    </>
  );
}
