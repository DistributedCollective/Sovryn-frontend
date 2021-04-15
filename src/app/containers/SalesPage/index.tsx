/**
 *
 * SalesPage
 *
 */

import React, { useEffect } from 'react';
import 'styles/sass/_genesis-sale.scss';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { translations } from '../../../locales/i18n';
import { Header } from '../../components/Header';
import { useAccount, useIsConnected } from '../../hooks/useAccount';

import PageHeader from '../../components/PageHeader';

import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';

import { AboutSOV, SOVModel, SOVGovernance } from './Information';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
  actions,
  sliceKey as salesSlice,
  reducer as salesReducer,
} from './slice';
import { salesPageSaga } from './saga';
import { AddSoToNifty } from './AddSoToNifty';
import { AddSoToMetamask } from './AddToMetamask';
import { StyledButton } from '../../components/SalesButton';
import GetAccess from './GetAccess';

function detectInjectableWallet() {
  const { ethereum } = window as any;
  if (ethereum?.isNiftyWallet) {
    return 'nifty';
  }
  if (ethereum?.isMetaMask) {
    return 'metamask';
  }
  return 'unknown';
}

export function SalesPage() {
  useInjectReducer({ key: salesSlice, reducer: salesReducer });
  useInjectSaga({ key: salesSlice, saga: salesPageSaga });

  const { t } = useTranslation();
  const isConnected = useIsConnected();
  const account = useAccount();
  const dispatch = useDispatch();

  const { value: maxPurchase } = useCacheCallWithValue<number>(
    'CrowdSale',
    'getMaxPurchase',
    '0',
    account,
  );

  const { value: totalDeposits } = useCacheCallWithValue<number>(
    'CrowdSale',
    'InvestorTotalDeposits',
    '0',
    account,
  );

  const { value: minPurchase } = useCacheCallWithValue<number>(
    'CrowdSale',
    'minPurchase',
    '0',
  );

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

  useEffect(() => {
    dispatch(actions.connectChannel());
  }, [dispatch]);

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
        className="tw-container tw-mx-auto tw-px-4"
        style={{ maxWidth: '1730px', letterSpacing: 'normal' }}
      >
        <>
          <PageHeader content={<>SOV PUBLIC PRE-SALE WHITELIST</>} />
          <GetAccess />
        </>
        <AboutSOV />
        <SOVModel />
        <SOVGovernance />
        {
          <div className="footer tw-flex tw-justify-center tw-mb-12">
            <StyledButton
              as="a"
              href="https://docsend.com/view/mbhvi379crhagtwp"
              target="_blank"
              rel="noreferrer noopener"
            >
              Read Blackpaper
            </StyledButton>
          </div>
        }
      </main>
      {detectInjectableWallet() === 'nifty' && <AddSoToNifty />}
      {detectInjectableWallet() === 'metamask' && <AddSoToMetamask />}
    </div>
  );
}
