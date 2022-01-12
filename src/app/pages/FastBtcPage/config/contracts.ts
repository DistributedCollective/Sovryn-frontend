import { ethers } from 'ethers';
import { AppMode, Chain } from 'types';
import fastBtcBridgeAbi from 'utils/blockchain/abi/fastBtcBridge.json';
import erc20TokenAbi from 'utils/blockchain/abi/erc20.json';

export type FastBTCWithdrawContractName =
  | 'fastBtcBridge'
  | 'btcToken'
  | 'aggregator';

export type AppModelToContractAddressMap = Record<AppMode, string>;

export type ChainToContractsMap = {
  address: Partial<Record<Chain, AppModelToContractAddressMap>>;
  abi: ethers.ContractInterface;
};

export const contracts: Record<
  FastBTCWithdrawContractName,
  ChainToContractsMap
> = {
  fastBtcBridge: {
    address: {
      [Chain.RSK]: {
        [AppMode.MAINNET]: ethers.constants.AddressZero, // todo
        [AppMode.TESTNET]: '0x10C848e9495a32acA95F6c23C92eCA2b2bE9903A', // todo should be new?
      },
      [Chain.BSC]: {
        [AppMode.MAINNET]: ethers.constants.AddressZero, // todo
        [AppMode.TESTNET]: '0x10C848e9495a32acA95F6c23C92eCA2b2bE9903A',
      },
    },
    abi: fastBtcBridgeAbi,
  },
  btcToken: {
    address: {
      [Chain.RSK]: {
        [AppMode.MAINNET]: ethers.constants.AddressZero,
        [AppMode.TESTNET]: ethers.constants.AddressZero,
      },
      [Chain.BSC]: {
        [AppMode.MAINNET]: ethers.constants.AddressZero, // todo
        [AppMode.TESTNET]: '0x0ed2a1edde92b25448db95e5aa9fe9e9bc0193bf',
      },
    },
    abi: erc20TokenAbi,
  },
  aggregator: {
    address: {
      [Chain.BSC]: {
        [AppMode.MAINNET]: ethers.constants.AddressZero, // todo
        [AppMode.TESTNET]: '0xe2C2fbAa4407fa8BB0Dbb7a6a32aD36f8bA484aE',
      },
    },
    abi: erc20TokenAbi,
  },
};
