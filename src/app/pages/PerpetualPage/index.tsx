import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Tab } from '../../components/Tab';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';

import { useInjectReducer } from 'utils/redux-injectors';
import { translations } from 'locales/i18n';

import { reducer, sliceKey, actions } from './slice';
import { HeaderLabs } from '../../components/HeaderLabs';
import { Footer } from '../../components/Footer';
import { PerpetualPairDictionary } from '../../../utils/dictionaries/perpetual-pair-dictionary';
import { TradeForm } from './components/TradeForm';
import { Theme, TradingChart } from '../../components/TradingChart';
import { OpenPositionsTable } from './components/OpenPositionsTable';
import { useIsConnected } from '../../hooks/useAccount';
import { TradingHistory } from './components/TradingHistory';
import { useHistory, useLocation } from 'react-router-dom';
import { IPromotionLinkState } from '../LandingPage/components/Promotions/components/PromotionCard/types';
import { NotificationSettingsDialog } from './components/NotificationSettingsDialog';
import { selectPerpetualPage } from './selectors';
import { DataCard } from './components/DataCard';
import { AmmDepthChart } from './components/AmmDepthChart';
import { RecentTradesTable } from './components/RecentTradesTable';
import { ContractDetails } from './components/ContractDetails';
import { currentNetwork } from '../../../utils/classifiers';
import { ChainId } from '../../../types';
import { useWalletContext } from '@sovryn/react-wallet';
import { ProviderType } from '@sovryn/wallet';
import styles from './index.module.scss';
import { AccountBalanceCard } from './components/AccountBalanceCard';
import { usePerpetual_accountBalance } from './hooks/usePerpetual_accountBalance';
import { AccountDialog } from './components/AccountDialog';

export function PerpetualPage() {
  useInjectReducer({ key: sliceKey, reducer: reducer });

  const dispatch = useDispatch();
  const walletContext = useWalletContext();

  const [
    showNotificationSettingsModal,
    setShowNotificationSettingsModal,
  ] = useState(false);

  const { pairType } = useSelector(selectPerpetualPage);
  const { available: availableBalance } = usePerpetual_accountBalance(pairType);
  const { t } = useTranslation();

  const location = useLocation<IPromotionLinkState>();
  const history = useHistory<IPromotionLinkState>();

  const [linkPairType, setLinkPairType] = useState(
    location.state?.perpetualPair,
  );

  useEffect(() => {
    setLinkPairType(location.state?.perpetualPair);
    history.replace(location.pathname);

    if (walletContext.provider !== ProviderType.WEB3) {
      walletContext.disconnect();
    }

    //set the bridge chain id to Matic
    dispatch(
      walletProviderActions.setBridgeChainId(
        currentNetwork === 'mainnet'
          ? ChainId.MATIC_MAINNET
          : ChainId.MATIC_TESTNET,
      ),
    );

    return () => {
      // Unset bridge settings
      dispatch(walletProviderActions.setBridgeChainId(null));
      dispatch(actions.reset());
    };

    // only run once on mounting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pair = useMemo(
    () => PerpetualPairDictionary.get(linkPairType || pairType),
    [linkPairType, pairType],
  );

  const connected = useIsConnected();
  const [activeTab, setActiveTab] = useState(0);

  const onNotificationSettingsClick = useCallback(
    () => setShowNotificationSettingsModal(true),
    [],
  );

  // This can be used for testing Deposit/Withdraw and also you can mint margin tokens

  // const { send, ...txState } = useSendContractTx('PERPETUALS_token', 'mint');
  // const onMintClick = useCallback(() => send([account, toWei(200)]), [
  //   account,
  //   send,
  // ]);

  // const { deposit, ...depositTx } = usePerpetual_depositMarginToken();
  // const onDepositClick = useCallback(() => deposit('20'), [deposit]);

  // const { withdraw, ...withdrawTx } = usePerpetual_withdrawMarginToken();
  // const onWithdrawClick = useCallback(() => withdraw('20'), [withdraw]);

  // const { send: sendMargin, ...rest } = useSendContractTx(
  //   'perpetualManager',
  //   'getMarginAccount',
  // );

  return (
    <>
      <Helmet>
        <title>{t(translations.perpetualPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.perpetualPage.meta.description)}
        />
      </Helmet>
      <HeaderLabs />
      <div className="tw-relative tw--top-2.5 tw-w-full">
        <div className="tw-w-full tw-bg-gray-2 tw-py-2">
          <div className="tw-container">
            <div>
              Pair Select Placeholder
              {/*TODO: implement pair select*/}
            </div>
          </div>
        </div>
        <ContractDetails pair={pair} />
      </div>
      <div className={'tw-container tw-mt-5'}>
        <div
          className={
            'tw-flex tw-flex-col tw-mb-8 xl:tw-flex-row xl:tw-justify-stretch tw-space-y-2 xl:tw-space-y-0 xl:tw-space-x-2'
          }
        >
          <DataCard
            className="xl:tw-w-1/5"
            title={`AMM Depth (${pairType.toString()})`}
          >
            <AmmDepthChart pair={pair} />
          </DataCard>
          <DataCard
            title={`Chart (${pairType.toString()})`}
            className={'tw-max-w-full xl:tw-w-3/5 2xl:tw-w-2/5'}
            hasCustomHeight
          >
            <TradingChart
              symbol={pair.chartSymbol}
              theme={Theme.DARK}
              hasCustomDimensions
            />
          </DataCard>
          <DataCard
            className="tw-flex-grow tw-block xl:tw-hidden 2xl:tw-block xl:tw-w-1/5"
            title={`Recent Trades (${pairType.toString()})`}
          >
            <RecentTradesTable pair={pair} />
          </DataCard>
          <div className="tw-flex tw-flex-col xl:tw-min-w-80 xl:tw-w-1/5 tw-space-y-2">
            <AccountBalanceCard balance={availableBalance} />
            <TradeForm
              pairType={linkPairType || pairType}
              balance={availableBalance}
            />
          </div>
        </div>

        {/* This can be used for testing Deposit/Withdraw and also you can mint margin tokens */}

        {/* <button onClick={onMintClick}>Mint 200 margin tokens</button>
        <button className="tw-block" onClick={onDepositClick}>
          Deposit 20 margin tokens
        </button>
        <button className="tw-block" onClick={onWithdrawClick}>
          Withdraw 20 margin tokens
        </button> */}

        {connected && (
          <>
            <div className="tw-flex tw-items-center tw-text-sm">
              <Tab
                text={t(translations.perpetualPage.openPositions)}
                active={activeTab === 0}
                onClick={() => setActiveTab(0)}
              />
              <Tab
                text={t(translations.perpetualPage.closedPositions)}
                active={activeTab === 1}
                onClick={() => setActiveTab(1)}
              />
              <Tab
                text={t(translations.perpetualPage.orderHistory)}
                active={activeTab === 2}
                onClick={() => setActiveTab(2)}
              />
            </div>

            <div className="tw-w-full tw-mb-24">
              {activeTab === 0 && <OpenPositionsTable perPage={5} />}
              {activeTab === 1 && (
                <div>
                  NOT IMPLEMENTED {/*TODO: implement closed positions table*/}
                </div>
              )}
              {activeTab === 2 && <TradingHistory />}
            </div>
          </>
        )}
      </div>
      <Footer />
      <NotificationSettingsDialog
        isOpen={showNotificationSettingsModal}
        onClose={() => setShowNotificationSettingsModal(false)}
      />
      <AccountDialog pairType={pairType} />
    </>
  );
}
