import { WalletProviderState } from 'app/containers/WalletProvider/types';
import { TradingPageState } from 'app/containers/TradingPage/types';
import { FastBtcFormState } from 'app/containers/FastBtcForm/types';
import { EmailNotificationState } from 'app/components/NotificationForm/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/*
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  walletProvider?: WalletProviderState;
  tradingPage?: TradingPageState;
  fastBtcForm?: FastBtcFormState;
  emailNotification?: EmailNotificationState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
