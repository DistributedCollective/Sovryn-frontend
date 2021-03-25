import React, { useEffect } from 'react';
import transakSDK from '@transak/transak-sdk';

interface Props {
  address: string;
  onClose: () => void;
}

export function OpenTransak({ address, onClose }: Props) {
  useEffect(() => {
    let transak = new transakSDK({
      apiKey: process.env.REACT_APP_TRANSAK_API_KEY, // Your API Key
      environment: process.env.REACT_APP_TRANSAK_ENV, // STAGING/PRODUCTION
      defaultCryptoCurrency: 'BTC',
      walletAddress: address, // Your customer's wallet address
      themeColor: '000000', // App theme color
      fiatCurrency: '', // INR/GBP
      email: '', // Your customer's email address
      redirectURL: '',
      hostURL: window.location.origin,
      widgetHeight: '550px',
      widgetWidth: '450px',
    });

    transak.init();

    // To get all the events
    transak.on(transak.ALL_EVENTS, data => {
      console.log(data);
    });

    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, orderData => {
      console.log(orderData);
      transak.close();
    });

    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
      console.log('Set FastBTCDialog back to MAIN');
      onClose();
    });
    // eslint-disable-next-line
  }, []);

  return <></>;
}
