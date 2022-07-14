import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

import { translations } from 'locales/i18n';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';
import { actions } from 'app/pages/PerpetualPage/slice';
import { HeaderLabs } from 'app/components/HeaderLabs';
import { Button } from 'app/pages/BuySovPage/components/Button';
import { Leaderboard } from './components/Leaderboard';
import { useIsConnected, useAccount } from 'app/hooks/useAccount';
import {
  isMainnet,
  discordInvite,
  notificationServiceUrl,
  currentChainId,
  WIKI_PERPETUAL_FUTURES_LINK,
} from 'utils/classifiers';
import { ChainId } from 'types';
import { useWalletContext } from '@sovryn/react-wallet';
import { ProviderType } from '@sovryn/wallet';
import { RegisteredTraderData } from './types';
import { PerpetualQueriesContextProvider } from '../../contexts/PerpetualQueriesContext';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from 'utils/dictionaries/perpetual-pair-dictionary';
import { RegisterDialog } from './components/RegisterDialog';

const baseUrl = notificationServiceUrl[currentChainId];

export const CompetitionPageContainer: React.FC = () => {
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredTraders, setRegisteredTraders] = useState<
    RegisteredTraderData[]
  >([]);

  const history = useHistory();
  const dispatch = useDispatch();
  const walletContext = useWalletContext();
  const account = useAccount();
  const connected = useIsConnected();
  const { t } = useTranslation();

  const getRegisteredWallets = useCallback(() => {
    axios
      .get(`${baseUrl}tradingCompetition`)
      .then(res => {
        if (res?.status === 200 && res.data) {
          setRegisteredTraders(res.data);
        }
      })
      .catch(console.error);
  }, []);

  const onClose = useCallback(
    (success: boolean) => {
      setIsRegistered(success);
      setRegisterDialogOpen(false);
      getRegisteredWallets();
    },
    [getRegisteredWallets],
  );

  useEffect(() => {
    getRegisteredWallets();

    if (walletContext.provider !== ProviderType.WEB3) {
      walletContext.disconnect();
    }

    //set the bridge chain id to BSC
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
    if (!account || !connected || isRegistered) {
      return;
    }

    axios
      .get(`${baseUrl}tradingCompetition/${account.toLowerCase()}`)
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
  }, [account, connected, isRegistered]);

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
        helpLink={WIKI_PERPETUAL_FUTURES_LINK}
        menus={
          <Link to="/perpetuals" className="tw-mr-4 tw-text-black">
            {t(translations.competitionPage.nav.perpetualSwap)}
          </Link>
        }
      />
      <PerpetualQueriesContextProvider pair={pair}>
        <div className="tw-container tw-my-12">
          <div className="tw-flex tw-flex-row tw-justify-evenly">
            <div className="tw-flex tw-flex-col tw-w-5/12">
              <Leaderboard
                showUserRow={isRegistered}
                data={registeredTraders}
                pair={pair}
              />
            </div>
            <div className="tw-flex tw-flex-col tw-w-5/12">
              <div className="tw-text-2xl tw-font-bold tw-mb-6">
                {t(translations.competitionPage.rules.title)}
              </div>

              <div className="tw-mt-2 tw-mb-8">
                <a
                  href="https://forms.monday.com/forms/5631b4b3608ad121f7e19af030f3b433"
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
                {connected && isRegistered && (
                  <>
                    <p className="tw-mb-8">
                      <Trans
                        i18nKey={translations.competitionPage.registered}
                        components={[<a href={discordInvite}>discord</a>]}
                      />
                    </p>
                    <Button
                      text={t(translations.competitionPage.cta.compete)}
                      onClick={() => history.push('/perpetuals')}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </PerpetualQueriesContextProvider>
      <RegisterDialog isOpen={registerDialogOpen} onClose={onClose} />
    </>
  );
};
