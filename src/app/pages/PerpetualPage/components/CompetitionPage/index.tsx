import React, { useEffect, useState, useCallback } from 'react';
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

export const CompetitionPage: React.FC = () => {
  const [registerDialogOpen, setRegisterDialogOpen] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [registeredTraders, setRegisteredTraders] = useState<
    RegisteredTraderData[]
  >([]);

  const dispatch = useDispatch();
  const walletContext = useWalletContext();
  const account = useAccount();
  const connected = useIsConnected();
  // const { t } = useTranslation();

  const getRegisteredWallets = () => {
    axios
      .get(`${notificationUrl}/tradingCompetition`)
      .then(res => {
        console.log('res: ', res);
        if (res?.status === 200 && res.data) {
          setRegisteredTraders(res.data);
        }
      })
      .catch(e => {
        console.log('e: ', e);
      });
  };
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
    if (!account || !connected) return;

    axios
      .get(`${notificationUrl}/tradingCompetition/${account.toLowerCase()}`)
      .then(res => {
        console.log('res: ', res);
        if (
          res?.status === 200 &&
          res?.data?.walletAddress === account.toLowerCase()
        )
          setIsRegistered(true);
      })
      .catch(e => {
        console.log('e: ', e);
        setIsRegistered(false);
      });
  }, [account, connected, registerDialogOpen]);

  return (
    <>
      <Helmet>
        {/* <title>{t(translations.perpetualPage.meta.title)}</title> */}
        <title>test</title>
        {/* <meta
          name="description"
          content={t(translations.perpetualPage.meta.description)}
        /> */}
        <meta name="description" content="test" />
      </Helmet>
      <HeaderLabs
        menus={
          <div className="tw-text-center" style={{ width: '300px' }}>
            <Link to="/perpetual" className="tw-mr-4 tw-text-black">
              <>Perpetual Swap</>
            </Link>
            <Link
              to="/perpetual/competition"
              className="tw-text-black hover:tw-no-underline"
            >
              <>Competition</>
            </Link>
          </div>
        }
      />
      <div className="tw-container tw-my-12">
        <div className="tw-flex tw-flex-row tw-justify-evenly">
          <div className="tw-flex tw-flex-col tw-w-5/12">
            <Leaderboard showUserRow={isRegistered} data={registeredTraders} />
          </div>
          <div className="tw-flex tw-flex-col tw-w-5/12">
            <div className="tw-text-2xl tw-font-bold tw-mb-6">
              Trading Competition Rules
            </div>
            <div className="">
              <ul className="tw-list-disc tw-mb-4">
                <li className="tw-mb-4">
                  Every user can register their wallet to participate in the
                  competition through a whitelisting process.
                </li>
                <li className="tw-mb-4">
                  Every participant will be sent a specific amount of RBTC
                  and/or BNB to start trading on the perpetual pairs of BNB/USD
                  and BTC/USD.
                </li>
                <li className="tw-mb-4">
                  The cumulative P&L of the participants is the deciding factor
                  for the winner.
                </li>
                <li className="tw-mb-4">
                  The competition is held for 2-3 weeks.
                </li>
                <li className="tw-mb-4">
                  End of competition -&gt; Set date for participants to close
                  all their perpetual positions within a day, if they do not
                  close it they are excluded from the competition.
                </li>
              </ul>
            </div>
            <div className="tw-w-6/12">
              {!connected && (
                <Button
                  text="Connect wallet"
                  disabled={connected}
                  onClick={() => walletContext.connect()}
                />
              )}
              {connected && !isRegistered && (
                <Button
                  text="Enter Contest"
                  onClick={() => setRegisterDialogOpen(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <RegisterDialog
        isOpen={registerDialogOpen}
        onClose={() => {
          setRegisterDialogOpen(false);
          getRegisteredWallets();
        }}
      />
    </>
  );
};
