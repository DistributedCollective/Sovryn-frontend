import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { translations } from 'locales/i18n';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';
import { actions } from 'app/pages/PerpetualPage/slice';
import { HeaderLabs } from 'app/components/HeaderLabs';
import { Button } from 'app/pages/BuySovPage/components/Button';
import { Leaderboard } from './components/Leaderboard';
import { Footer } from 'app/components/Footer';
import { useIsConnected, useAccount } from 'app/hooks/useAccount';
import { RegisterDialog } from './components/RegisterDialog';
import { isMainnet, notificationUrl } from 'utils/classifiers';
import { ChainId } from 'types';
import { useWalletContext } from '@sovryn/react-wallet';
import { ProviderType } from '@sovryn/wallet';
import { RegisteredTraderData } from './types';
import { PerpetualQueriesContextProvider } from '../../contexts/PerpetualQueriesContext';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from 'utils/dictionaries/perpetual-pair-dictionary';

export const CompetitionPageContainer: React.FC = () => {
  const [registerDialogOpen, setRegisterDialogOpen] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [registeredTraders, setRegisteredTraders] = useState<
    RegisteredTraderData[]
  >([]);

  const dispatch = useDispatch();
  const walletContext = useWalletContext();
  const account = useAccount();
  const connected = useIsConnected();
  const { t } = useTranslation();

  const getRegisteredWallets = useCallback(() => {
    axios
      .get(`${notificationUrl}/tradingCompetition`)
      .then(res => {
        if (res?.status === 200 && res.data) {
          setRegisteredTraders(res.data);
        }
      })
      .catch(e => {
        console.error(e);
      });
  }, []);

  const onClose = useCallback(() => {
    setRegisterDialogOpen(false);
    getRegisteredWallets();
  }, [getRegisteredWallets]);

  useEffect(() => {
    getRegisteredWallets();

    if (walletContext.provider !== ProviderType.WEB3) {
      walletContext.disconnect();
    }

    //set the bridge chain id to Matic
    dispatch(
      walletProviderActions.setBridgeChainId(
        isMainnet ? ChainId.BSC_MAINNET : ChainId.BSC_TESTNET,
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

  useEffect(() => {
    if (!account || !connected) {
      return;
    }

    axios
      .get(`${notificationUrl}/tradingCompetition/${account.toLowerCase()}`)
      .then(res => {
        if (
          res?.status === 200 &&
          res?.data?.walletAddress === account.toLowerCase()
        )
          setIsRegistered(true);
      })
      .catch(e => {
        console.error(e);
        setIsRegistered(false);
      });
  }, [account, connected, registerDialogOpen]);

  const pair = useMemo(
    () => PerpetualPairDictionary.get(PerpetualPairType.BTCUSD),
    [],
  );

  return (
    <>
      <Helmet>
        <title>{t(translations.competitionPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.competitionPage.meta.description)}
        />
      </Helmet>
      <HeaderLabs
        menus={
          <div className="tw-text-center" style={{ width: '300px' }}>
            <Link to="/perpetual" className="tw-mr-4 tw-text-black">
              {t(translations.competitionPage.nav.perpetualSwap)}
            </Link>
            <Link
              to="/perpetual/competition"
              className="tw-text-black hover:tw-no-underline"
            >
              {t(translations.competitionPage.nav.competition)}
            </Link>
          </div>
        }
      />
      <PerpetualQueriesContextProvider pair={pair} updateInterval={60000}>
        <div className="tw-container tw-my-12">
          <div className="tw-flex tw-flex-row tw-justify-evenly">
            <div className="tw-flex tw-flex-col tw-w-5/12">
              <Leaderboard
                showUserRow={isRegistered}
                data={registeredTraders}
              />
            </div>
            <div className="tw-flex tw-flex-col tw-w-5/12">
              <div className="tw-text-2xl tw-font-bold tw-mb-6">
                {t(translations.competitionPage.rules.title)}
              </div>

              <div className="tw-mt-2 tw-mb-8">
                <a
                  href="https://forms.monday.com/forms/c3227cbc08a9075d3e326dc2dc07d24e"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t(translations.competitionPage.rules.reportBugs)}
                </a>
              </div>

              <div className="tw-w-6/12">
                {!connected && (
                  <Button
                    text={t(translations.competitionPage.cta.connect)}
                    disabled={connected}
                    onClick={() => walletContext.connect()}
                  />
                )}
                {connected && !isRegistered && (
                  <Button
                    text={t(translations.competitionPage.cta.enter)}
                    onClick={() => setRegisterDialogOpen(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </PerpetualQueriesContextProvider>
      <Footer />
      <RegisterDialog isOpen={registerDialogOpen} onClose={onClose} />
    </>
  );
};
