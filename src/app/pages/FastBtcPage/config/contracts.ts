import { ethers } from 'ethers';
import { AppMode, Chain } from 'types';
import fastBtcBridgeAbi from 'utils/blockchain/abi/fastBtcBridge.json';

export type FastBTCWithdrawContractName = 'fastBtcBridge';

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
        [AppMode.TESTNET]: '0x53b202E87Eb5F60a9779c4Dcae14c1037D2C0422', // todo should be new?
      },
      [Chain.BSC]: {
        [AppMode.MAINNET]: ethers.constants.AddressZero, // todo
        [AppMode.TESTNET]: ethers.constants.AddressZero, // todo
      },
    },
    abi: fastBtcBridgeAbi,
  },
};
