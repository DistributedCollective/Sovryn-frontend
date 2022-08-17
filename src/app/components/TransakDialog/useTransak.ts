import { WalletContext } from '@sovryn/react-wallet';
import { isWeb3Wallet } from '@sovryn/wallet';
import { useMemo, useEffect, useState, useCallback, useContext } from 'react';
import transakSDK from '@transak/transak-sdk';

import { useAccount } from 'app/hooks/useAccount';
import { currentChainId } from 'utils/classifiers';

export const useTransak = () => {
  const { connected, wallet } = useContext(WalletContext);
  const account = useAccount();
  const [open, setOpen] = useState(false);

  const isWrongChainId = useMemo(
    () =>
      connected &&
      isWeb3Wallet(wallet.providerType!) &&
      wallet.chainId !== currentChainId,
    [connected, wallet.chainId, wallet.providerType],
  );

  useEffect(() => {
    if (open && account !== '') {
      const transakSettings = {
        apiKey: process.env.REACT_APP_TRANSAK_API_KEY, // Your API Key
        environment: process.env.REACT_APP_TRANSAK_ENV, // STAGING/PRODUCTION
        defaultCryptoCurrency: 'RBTC',
        walletAddress: account, // Your customer's wallet address
        themeColor: '000000', // App theme color
        fiatCurrency: '', // INR/GBP
        email: '', // Your customer's email address
        redirectURL: '',
        hostURL: window.location.origin,
        widgetHeight: '550px',
        widgetWidth: '450px',
        disableWalletAddressForm: true,
        cryptoCurrencyCode: 'RBTC',
        cryptoCurrencyList: 'RBTC',
        hideMenu: true,
      };
      const transak = new transakSDK(transakSettings);
      transak.init();
      // This will trigger when the user marks payment is made.
      transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, orderData => {
        // transak.close();
      });
      transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
        setOpen(false);
      });
    }
  }, [account, open]);

  const handleClick = useCallback(() => setOpen(true), []);

  return { handleClick, isWrongChainId };
};
