import transakSDK from '@transak/transak-sdk';

let transak = new transakSDK({
  apiKey: '4fcd6904-706b-4aff-bd9d-77422813bbb7', // Your API Key
  environment: 'STAGING', // STAGING/PRODUCTION
  defaultCryptoCurrency: 'ETH',
  walletAddress: '', // Your customer's wallet address
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

export default transak;
