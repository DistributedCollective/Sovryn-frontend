import { ethers } from 'ethers';
import { AppMode, Chain } from 'types';
import erc20TokenAbi from 'utils/blockchain/abi/erc20.json';
import allowTokensAbi from 'utils/blockchain/abi/AllowTokensAbi.json';

const aggregatorAbi = [
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_basset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_massetQuantity',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_userData',
        type: 'bytes',
      },
    ],
    name: 'redeemToBridge',
    outputs: [
      {
        internalType: 'uint256',
        name: 'massetRedeemed',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export type FastBTCWithdrawContractName =
  | 'btcToken'
  | 'btcWrapperToken'
  | 'aggregator'
  | 'aggregatorBasset'
  | 'aggregatorAllowTokens';

export type AppModelToContractAddressMap = Record<AppMode, string>;

export type ChainToContractsMap = {
  address: Partial<Record<Chain, AppModelToContractAddressMap>>;
  abi: ethers.ContractInterface;
};

export const contracts: Record<
  FastBTCWithdrawContractName,
  ChainToContractsMap
> = {
  btcToken: {
    address: {
      [Chain.RSK]: {
        [AppMode.MAINNET]: ethers.constants.AddressZero,
        [AppMode.TESTNET]: ethers.constants.AddressZero,
      },
      [Chain.BSC]: {
        [AppMode.MAINNET]: '0x2591c762e8C9Fe28A03B035b380110dD599aE987',
        [AppMode.TESTNET]: '0xd0370a808203da14B703826eF77072ef5F09840D',
      },
    },
    abi: erc20TokenAbi,
  },
  btcWrapperToken: {
    address: {
      [Chain.RSK]: {
        [AppMode.MAINNET]: '0xa233108b33dc77f1eee9d183ee1dc9725e76d475',
        [AppMode.TESTNET]: '0xf629e5c7527ac7bc9ce26bdd6d66f0eb955ef3b2',
      },
    },
    abi: erc20TokenAbi,
  },
  aggregator: {
    address: {
      [Chain.BSC]: {
        [AppMode.MAINNET]: '0x769C0B52c83d335705Fb10b7b78b0C7637c3A6E0',
        [AppMode.TESTNET]: '0xc54B47AC178273A42Fb71631d8018aD7EBbec330',
      },
    },
    abi: aggregatorAbi,
  },
  aggregatorBasset: {
    address: {
      [Chain.BSC]: {
        [AppMode.MAINNET]: '0x68e75416a99f61a8ef3186b3bee41dbf2a3fd4e8',
        [AppMode.TESTNET]: '0xc41d41cb7a31c80662ac2d8ab7a7e5f5841eebc3',
      },
    },
    abi: erc20TokenAbi,
  },
  aggregatorAllowTokens: {
    address: {
      [Chain.RSK]: {
        [AppMode.MAINNET]: '0xa2f50a2c699c1aa3b9089f6b565d4999d45d8983',
        [AppMode.TESTNET]: '0xa9f2ccb27fe01479a1f21f3a236989c614f801bc',
      },
    },
    abi: allowTokensAbi,
  },
};
