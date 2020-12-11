import { WalletProviderState } from 'app/containers/WalletProvider/types';
import { TradingPageState } from 'app/containers/TradingPage/types';
import { FastBtcFormState } from 'app/containers/FastBtcForm/types';
import { LendBorrowSovrynState } from 'app/containers/LendBorrowSovryn/types';
import { EventsStoreState } from '../store/global/events-store/types';
import { TransactionsStoreState } from '../store/global/transactions-store/types';
import { TopUpBtcDialogState } from 'app/containers/TopUpBtcDialog/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/*
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  walletProvider?: WalletProviderState;
  tradingPage?: TradingPageState;
  fastBtcForm?: FastBtcFormState;
  lendBorrowSovryn?: LendBorrowSovrynState;
  eventsState?: EventsStoreState;
  transactionsState?: TransactionsStoreState;
  topUpBtcDialog?: TopUpBtcDialogState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
