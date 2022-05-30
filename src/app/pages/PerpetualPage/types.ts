import { Asset, Nullable, Chain, ChainId } from '../../../types';
import { TradingPosition } from '../../../types/trading-position';
import { PerpetualPairType } from '../../../utils/dictionaries/perpetual-pair-dictionary';
import { Transaction } from 'ethers';
import { CheckAndApproveResult } from '../../../utils/sovryn/contract-writer';
import { getBridgeChainId } from '../BridgeDepositPage/utils/helpers';
import { isMainnet } from '../../../utils/classifiers';
import { toWei } from '../../../utils/blockchain/math-helpers';
import { Validation } from './utils/contractUtils';

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
  GSN_APPROVAL = 'GSN_APPROVAL',
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
  entryPrice?: string;
  /** current average price as wei string */
  averagePrice?: string;
  expiry?: number;
  leverage: number;
  slippage: number;
  keepPositionLeverage?: boolean;
  isClosePosition?: boolean;
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
  (x.entryPrice === undefined || typeof x.entryPrice === 'string') &&
  (x.averagePrice === undefined || typeof x.averagePrice === 'string') &&
  (x.limit === undefined || typeof x.limit === 'string') &&
  (x.trigger === undefined || typeof x.trigger === 'string') &&
  (x.margin === undefined || typeof x.margin === 'string') &&
  (x.keepPositionLeverage === undefined ||
    typeof x.keepPositionLeverage === 'boolean') &&
  (x.isClosingPosition === undefined ||
    typeof x.isClosingPosition === 'boolean');

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

export type PerpetualTradeAnalysis = {
  amountChange: number;
  amountTarget: number;
  marginChange: number;
  marginTarget: number;
  partialUnrealizedPnL: number;
  leverageTarget: number;
  entryPrice: number;
  limitPrice: number;
  liquidationPrice: number;
  orderCost: number;
  tradingFee: number;
  requiredAllowance: number;
  loading: boolean;
  validation?: Validation;
};

export enum PerpetualTxMethod {
  trade = 'trade',
  createLimitOrder = 'createLimitOrder',
  cancelLimitOrder = 'cancelLimitOrder',
  deposit = 'deposit',
  withdraw = 'withdraw',
  withdrawAll = 'withdrawAll',
}

interface PerpetualTxBase {
  pair: PerpetualPairType;
  method: PerpetualTxMethod;
  tx: Nullable<string>;
  origin?: PerpetualPageModals;
  index?: number;
  count?: number;
  target?: {
    leverage: number;
  };
}

export interface PerpetualTxTrade extends PerpetualTxBase {
  method: PerpetualTxMethod.trade;
  /** amount as wei string */
  amount: string;
  price: string;
  leverage?: number;
  slippage?: number;
  tradingPosition?: TradingPosition;
  isClosePosition?: boolean;
  keepPositionLeverage?: boolean;

  approvalTx: Nullable<string>;
}

export interface PerpetualTxCreateLimitOrder extends PerpetualTxBase {
  method: PerpetualTxMethod.createLimitOrder;
  /** amount as wei string */
  amount: string;
  /** limit as wei string */
  limit: string;
  /** trigger as wei string */
  trigger: string;
  expiry: number;
  created: number;
  leverage?: number;
  tradingPosition?: TradingPosition;

  approvalTx: Nullable<string>;
}

export interface PerpetualTxCancelLimitOrder extends PerpetualTxBase {
  method: PerpetualTxMethod.cancelLimitOrder;
  /** LimitOrder digest/id */
  digest: string;
}

export interface PerpetualTxDepositMargin extends PerpetualTxBase {
  method: PerpetualTxMethod.deposit;
  /** amount as wei string */
  amount: string;

  approvalTx: Nullable<string>;
}

export interface PerpetualTxWithdrawMargin extends PerpetualTxBase {
  method: PerpetualTxMethod.withdraw;
  /** amount as wei string */
  amount: string;
}

export interface PerpetualTxWithdrawAllMargin extends PerpetualTxBase {
  method: PerpetualTxMethod.withdrawAll;
}

export type PerpetualTx =
  | PerpetualTxTrade
  | PerpetualTxCreateLimitOrder
  | PerpetualTxCancelLimitOrder
  | PerpetualTxDepositMargin
  | PerpetualTxWithdrawMargin
  | PerpetualTxWithdrawAllMargin;

export const isPerpetualTx = (x: any): x is PerpetualTx =>
  x && typeof x === 'object' && PerpetualTxMethod[x.method] !== undefined;

export const isTrade = (
  transaction: PerpetualTx,
): transaction is PerpetualTxTrade =>
  transaction.method === PerpetualTxMethod.trade;

export const isDepositMargin = (
  transaction: PerpetualTx,
): transaction is PerpetualTxDepositMargin =>
  transaction.method === PerpetualTxMethod.deposit;

export const isWithdrawMargin = (
  transaction: PerpetualTx,
): transaction is PerpetualTxWithdrawMargin =>
  transaction.method === PerpetualTxMethod.withdraw;

export const isWithdrawAllMargin = (
  transaction: PerpetualTx,
): transaction is PerpetualTxWithdrawAllMargin =>
  transaction.method === PerpetualTxMethod.withdrawAll;

export const isCreateLimitOrder = (
  transaction: PerpetualTx,
): transaction is PerpetualTxCreateLimitOrder =>
  transaction.method === PerpetualTxMethod.createLimitOrder;

export const isCancelLimitOrder = (
  transaction: PerpetualTx,
): transaction is PerpetualTxCancelLimitOrder =>
  transaction.method === PerpetualTxMethod.cancelLimitOrder;
