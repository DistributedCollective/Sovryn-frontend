import { Asset, Nullable, Chain, ChainId } from '../../../types';
import { TradingPosition } from '../../../types/trading-position';
import { PerpetualPairType } from '../../../utils/dictionaries/perpetual-pair-dictionary';
import { Transaction } from 'ethers';
import { PerpetualTx } from './components/TradeDialog/types';
import { CheckAndApproveResult } from '../../../utils/sovryn/contract-writer';
import { getBridgeChainId } from '../BridgeDepositPage/utils/helpers';
import { isMainnet } from '../../../utils/classifiers';
import { toWei } from '../../../utils/blockchain/math-helpers';

export const PERPETUAL_SLIPPAGE_DEFAULT = 0.005;
export const PERPETUAL_EXPIRY_DEFAULT = 30;
export const PERPETUAL_MAX_LEVERAGE_DEFAULT = 15;
export const PERPETUAL_CHAIN = Chain.BSC;
export const PERPETUAL_CHAIN_ID =
  getBridgeChainId(Chain.BSC) || ChainId.BSC_MAINNET;
export const PERPETUAL_PAYMASTER = isMainnet
  ? '' // TODO: add mainnet paymaster address
  : '0x516181Fe2053B3b5CfD547f1220Fa9cdD38e7f9B';

export const PERPETUAL_GAS_PRICE_DEFAULT = isMainnet
  ? undefined
  : toWei(10, 'gwei');

export enum PerpetualTradeType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP = 'STOP',
  LIQUIDATION = 'LIQUIDATION',
}

export enum PerpetualPageModals {
  NONE = 'NONE',
  ACCOUNT_BALANCE = 'ACCOUNT_BALANCE',
  TRADE_REVIEW = 'TRADE_REVIEW',
  EDIT_LEVERAGE = 'EDIT_LEVERAGE',
  EDIT_MARGIN = 'EDIT_MARGIN',
  CLOSE_POSITION = 'CLOSE_POSITION',
  CANCEL_ORDER = 'CANCEL_ORDER',
}

export type PerpetualTradeEvent = {
  id: string;
  perpetual: {
    id: string;
  };
  orderFlags: string;
  orderDigest?: string;
  tradeAmountBC: string;
  newPositionSizeBC: string;
  price: string;
  limitPrice: string;
  isClose: string;
  blockTimestamp: string;
  transaction: { id: string };
  trader?: { id: string };
  position?: { id: string };
};

export type PerpetualLiquidationEvent = {
  id: string;
  perpetual: {
    id: string;
  };
  amountLiquidatedBC: string;
  newPositionSizeBC: string;
  liquidationPrice: string;
  blockTimestamp: string;
  transaction: { id: string };
  liquidator?: { id: string };
  trader?: { id: string };
  position?: { id: string };
};

export type PerpetualPositionEvent = {
  id: string;
  perpetual: { id: string };
  trader?: { id: string };
  isClosed: boolean;
  totalPnLCC: string;
  currentPositionSizeBC: string;
  highestSizeBC: string;
  lowestSizeBC: string;
  startDate?: string;
  endDate?: string;
  lastChanged?: string;
  startPositionSizeBC?: string;
  tradesCount?: number;
};

export enum LimitOrderState {
  ACTIVE = 'Active',
  CANCELLED = 'Cancelled',
  FILLED = 'Filled',
}

export type LimitOrderEvent = {
  id: string;
  perpetual: { id: string };
  triggerPrice: string;
  limitPrice: string;
  tradeAmount: string;
  state: LimitOrderState;
  deadline: string;
  createdTimestamp: string;
  createdTransactionHash: string;
};

export type PerpetualTrade = {
  id?: string;
  pairType: PerpetualPairType;
  collateral: Asset;
  tradeType: PerpetualTradeType;
  position: TradingPosition;
  /** base value as wei string */
  amount: string;
  /** limit quote price as wei string */
  limit?: string;
  /** trigger quote price as wei string */
  trigger?: string;
  /** collateral value wei string */
  margin?: string;
  /** expected entry price as wei string */
  entryPrice: string;
  expiry?: number;
  leverage: number;
  slippage: number;
  keepPositionLeverage?: boolean;
};

export type PerpetualTradeReview = {
  origin: PerpetualPageModals;
  trade: PerpetualTrade;
  transactions: PerpetualTx[];
};

export type PendingTransactions = Nullable<Transaction>[];

export const isPerpetualTrade = (x: any): x is PerpetualTrade =>
  x &&
  typeof x === 'object' &&
  typeof x.pairType === 'string' &&
  typeof x.collateral === 'string' &&
  typeof x.tradeType === 'string' &&
  typeof x.position === 'string' &&
  typeof x.amount === 'string' &&
  typeof x.leverage === 'number' &&
  typeof x.slippage === 'number' &&
  typeof x.entryPrice === 'string' &&
  (x.limit === undefined || typeof x.limit === 'string') &&
  (x.trigger === undefined || typeof x.trigger === 'string') &&
  (x.margin === undefined || typeof x.margin === 'string');

export const isPerpetualTradeReview = (x: any): x is PerpetualTradeReview =>
  x &&
  typeof x === 'object' &&
  PerpetualPageModals[x.origin] !== undefined &&
  isPerpetualTrade(x.trade) &&
  Array.isArray(x.transactions);

export type PerpetualPageState = {
  pairType: PerpetualPairType;
  collateral: Asset;
  useMetaTransactions: boolean;
  modal: PerpetualPageModals;
  modalOptions?: PerpetualTrade | PerpetualTradeReview | PendingTransactions;
  toastedTransactions: string[];
  showAmmDepth: boolean;
  showChart: boolean;
  showRecentTrades: boolean;
  showTradeForm: boolean;
  showTables: boolean;
  isAddressWhitelisted: boolean;
};

export type ContainerState = PerpetualPageState;

export type CheckAndApproveResultWithError = CheckAndApproveResult & {
  error?: Error;
};
