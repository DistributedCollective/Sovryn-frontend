import { useMemo } from 'react';
import { bignumber } from 'mathjs';
import { useFilterSimulatorResponseLogs } from 'app/hooks/simulator/useFilterSimulatorResponseLogs';
import { useSimulator } from 'app/hooks/simulator/useSimulator';
import { usePositionLiquidationPrice } from 'app/hooks/trading/usePositionLiquidationPrice';
import { Asset } from 'types';
import { TradeEventData } from 'types/active-loan';
import { TradingPosition } from 'types/trading-position';
import {
  getContract,
  getLendingContractName,
} from 'utils/blockchain/contract-helpers';
import {
  MAINTENANCE_MARGIN,
  TRADE_LOG_SIGNATURE_HASH,
} from 'utils/classifiers';

const TradeLogInputs = [
  {
    indexed: true,
    internalType: 'address',
    name: 'user',
    type: 'address',
  },
  {
    indexed: true,
    internalType: 'address',
    name: 'lender',
    type: 'address',
  },
  {
    indexed: true,
    internalType: 'bytes32',
    name: 'loanId',
    type: 'bytes32',
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'collateralToken',
    type: 'address',
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'loanToken',
    type: 'address',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'positionSize',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'borrowedAmount',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'interestRate',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'settlementDate',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'entryPrice',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'entryLeverage',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'currentLeverage',
    type: 'uint256',
  },
];

export const useSimulatedTrade = (
  loanToken: Asset,
  collateral: Asset,
  txArgs: string[],
  position: TradingPosition,
  amount: string,
) => {
  const contractName = useMemo(() => getLendingContractName(loanToken), [
    loanToken,
  ]);

  const simulator = useFilterSimulatorResponseLogs<TradeEventData>(
    useSimulator(
      contractName,
      'marginTrade',
      txArgs,
      collateral === Asset.RBTC ? amount : '0',
      amount !== '0' && !txArgs.includes(''),
      collateral !== Asset.WRBTC
        ? {
            asset: collateral,
            spender: getContract(contractName).address,
            amount,
          }
        : undefined,
    ),
    TRADE_LOG_SIGNATURE_HASH,
    TradeLogInputs,
  );

  const { entryPrice, positionSize, borrowedAmount } = useMemo(() => {
    const log: TradeEventData | undefined = simulator.logs.shift()?.decoded;
    const price = log?.entryPrice || '0';
    const entryPrice =
      position === TradingPosition.LONG
        ? bignumber(1)
            .div(price)
            .mul(10 ** 36)
            .toFixed(0)
        : price;
    return {
      entryPrice: isFinite(Number(entryPrice)) ? entryPrice : '0',
      positionSize: log?.positionSize || '0',
      borrowedAmount: log?.borrowedAmount || '0',
    };
  }, [simulator.logs, position]);

  const liquidationPrice = usePositionLiquidationPrice(
    borrowedAmount,
    positionSize,
    position,
    MAINTENANCE_MARGIN,
  );

  return {
    simulator,
    entryPrice,
    liquidationPrice:
      isFinite(Number(liquidationPrice)) && !isNaN(Number(liquidationPrice))
        ? liquidationPrice
        : '0',
    positionSize,
    borrowedAmount,
  };
};
