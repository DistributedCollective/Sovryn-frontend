/**
 *
 * WalletPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { actions } from '../FastBtcForm/slice';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { useDispatch, useSelector } from 'react-redux';
import { selectFastBtcForm } from '../FastBtcForm/selectors';
import { translations } from '../../../locales/i18n';
import { Icon } from '@blueprintjs/core';
import { LinkToExplorer } from '../../components/LinkToExplorer';
import { weiToFixed } from '../../../utils/blockchain/math-helpers';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

const s = translations.fastBtcForm;

interface Props {}

export function WalletPage(props: Props) {
  const { t } = useTranslation();

  const isConnected = useIsConnected();
  const account = useAccount();
  const state = useSelector(selectFastBtcForm);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isConnected && account) {
      dispatch(actions.changeReceiverAddress(account));
    }
  }, [account, isConnected, dispatch]);

  return (
    <>
      <Helmet>
        <title>{t(translations.walletPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.walletPage.meta.description)}
        />
      </Helmet>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h3 className="mb-3">{t(s.history.title)}</h3>
            <div className="sovryn-border p-3">
              {!state.history.length && !state.isHistoryLoading && (
                <p className="mb-0">{t(s.history.empty)}</p>
              )}
              {state.isHistoryLoading && !state.history.length && (
                <SkeletonRow
                  loadingText={
                    !account ? t(s.history.walletHistory) : t(s.history.loading)
                  }
                />
              )}
              {state.history.map(item => (
                <div
                  className="d-flex flex-row justify-content-between w-100"
                  key={item.txHash}
                >
                  <div className="d-flex flex-row align-items-center mr-3">
                    <div className="mr-3">
                      <Icon
                        icon={
                          item.type === 'deposit'
                            ? 'chevron-right'
                            : 'chevron-left'
                        }
                      />
                    </div>
                    <LinkToExplorer
                      txHash={item.txHash}
                      realBtc={item.type === 'deposit'}
                    />
                  </div>
                  <div>
                    {weiToFixed(item.valueBtc * 1e10, 4)}{' '}
                    <span className="text-muted">
                      {item.type === 'deposit' ? 'BTC' : 'rBTC'}
                    </span>{' '}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
