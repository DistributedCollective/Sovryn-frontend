import { WalletProviderState } from 'app/containers/WalletProvider/types';
import { LendBorrowSovrynState } from 'app/pages/BorrowPage/types';
import { EventsStoreState } from '../store/global/events-store/types';
import { TransactionsStoreState } from '../store/global/transactions-store/types';
import { MaintenanceStoreState } from '../store/global/maintenance-store/types';
import { IMarginTradePageState } from 'app/pages/MarginTradePage/types';
import { SpotTradingPageState } from 'app/pages/SpotTradingPage/types';
import { BridgeDepositPageState } from 'app/pages/BridgeDepositPage/types';
import { BridgeWithdrawPageState } from 'app/pages/BridgeWithdrawPage/types';
import { PerpetualPageState } from '../app/pages/PerpetualPage/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/*
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  walletProvider?: WalletProviderState;
  lendBorrowSovryn?: LendBorrowSovrynState;
  eventsState?: EventsStoreState;
  transactionsState?: TransactionsStoreState;
  maintenanceState?: MaintenanceStoreState;
  marginTradePage?: IMarginTradePageState;
  spotTradingPage?: SpotTradingPageState;
  perpetualPage?: PerpetualPageState;
  bridgeDepositPage?: BridgeDepositPageState;
  bridgeWithdrawPage?: BridgeWithdrawPageState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
