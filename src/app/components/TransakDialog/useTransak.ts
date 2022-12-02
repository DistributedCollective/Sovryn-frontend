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

  const [config, setConfig] = useState<{ address: string; currency: string }>({
    address: account,
    currency: 'RBTC',
  });

  const isWrongChainId = useMemo(
    () =>
      connected &&
      isWeb3Wallet(wallet.providerType!) &&
      wallet.chainId !== currentChainId,
    [connected, wallet.chainId, wallet.providerType],
  );

  useEffect(() => {
    if (open && config.address !== '') {
      const transakSettings = {
        apiKey: process.env.REACT_APP_TRANSAK_API_KEY, // Your API Key
        environment: process.env.REACT_APP_TRANSAK_ENV, // STAGING/PRODUCTION
        defaultCryptoCurrency: config.currency,
        walletAddress: config.address, // Your customer's wallet address
        themeColor: '000000', // App theme color
        fiatCurrency: '', // INR/GBP
        email: '', // Your customer's email address
        redirectURL: '',
        hostURL: window.location.origin,
        widgetHeight: '550px',
        widgetWidth: '450px',
        disableWalletAddressForm: true,
        cryptoCurrencyCode: config.currency,
        cryptoCurrencyList: config.currency,
        hideMenu: true,
      };
      const transak = new transakSDK(transakSettings);
      transak.init();
      // This will trigger when the user marks payment is made.
      transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, orderData => {
        console.log('market as done', orderData);
        // transak.close();
      });
      transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
        setOpen(false);
      });
    }
  }, [config, open]);

  const handleClick = useCallback(
    (defaultCurrency: string, depositAddress?: string) => {
      setConfig({
        currency: defaultCurrency,
        address: depositAddress || account,
      });
      setOpen(true);
    },
    [account],
  );

  return { handleClick, isWrongChainId };
};
