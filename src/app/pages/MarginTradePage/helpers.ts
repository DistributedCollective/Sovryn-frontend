import { utils } from 'ethers';
import { _TypedDataEncoder } from 'ethers/lib/utils';
import { signData } from 'eth-permit/dist/rpc';
import { MarginLimitOrder } from './types';
import {
  getContract,
  getTokenContract,
} from '../../../utils/blockchain/contract-helpers';
import type { Asset } from '../../../types';

export class MarginOrder {
  static ORDER_TYPEHASH =
    '0xe30dcb91507ed7c8a9a2019b56e407eee8294529022e84f18b5420374e178404';

  readonly loanTokenAddress: string;
  readonly collateralTokenAddress: string;

  constructor(
    readonly loanId: string,
    readonly leverageAmount: string,
    loanToken: Asset,
    readonly loanTokenSent: string,
    readonly collateralTokenSent: string,
    collateralToken: Asset,
    readonly trader: string,
    readonly minReturn: string,
    readonly loanDataBytes: string,
    readonly deadline: string,
    readonly createdTimestamp: string,
    readonly v?: number,
    readonly r?: string,
    readonly s?: string,
  ) {
    this.loanTokenAddress = getTokenContract(loanToken).address;
    this.collateralTokenAddress = getTokenContract(collateralToken).address;
  }

  hash(overrides?: MarginLimitOrder) {
    return utils.keccak256(
      utils.defaultAbiCoder.encode(
        [
          'bytes32',
          'bytes32',
          'uint256',
          'address',
          'uint256',
          'uint256',
          'address',
          'address',
          'uint256',
          'bytes32',
          'uint256',
          'uint256',
        ],
        [
          MarginOrder.ORDER_TYPEHASH,
          overrides?.loanId || this.loanId,
          overrides?.leverageAmount || this.leverageAmount,
          overrides?.loanTokenAddress || this.loanTokenAddress,
          overrides?.loanTokenSent || this.loanTokenSent,
          overrides?.collateralTokenSent || this.collateralTokenSent,
          overrides?.collateralTokenAddress || this.collateralTokenAddress,
          overrides?.trader || this.trader,
          overrides?.minReturn || this.minReturn,
          overrides?.loanDataBytes || this.loanDataBytes,
          overrides?.deadline || this.deadline,
          overrides?.createdTimestamp || this.createdTimestamp,
        ],
      ),
    );
  }

  async sign(chainId: number) {
    const domain = {
      name: 'OrderBookMargin',
      version: '1',
      chainId,
      verifyingContract: getContract('orderBookMargin').address,
    };
    const types = {
      Order: [
        { name: 'loanId', type: 'bytes32' },
        { name: 'leverageAmount', type: 'uint256' },
        { name: 'loanTokenAddress', type: 'address' },
        { name: 'loanTokenSent', type: 'uint256' },
        { name: 'collateralTokenSent', type: 'uint256' },
        { name: 'collateralTokenAddress', type: 'address' },
        { name: 'trader', type: 'address' },
        { name: 'minReturn', type: 'uint256' },
        { name: 'loanDataBytes', type: 'bytes32' },
        { name: 'deadline', type: 'uint256' },
        { name: 'createdTimestamp', type: 'uint256' },
      ],
    };

    const value = {
      loanId: this.loanId,
      leverageAmount: this.leverageAmount,
      loanTokenAddress: this.loanTokenAddress,
      loanTokenSent: this.loanTokenSent,
      collateralTokenSent: this.collateralTokenSent,
      collateralTokenAddress: this.collateralTokenAddress,
      trader: this.trader,
      minReturn: this.minReturn,
      loanDataBytes: this.loanDataBytes,
      deadline: this.deadline,
      createdTimestamp: this.createdTimestamp,
    };

    const payload = _TypedDataEncoder.getPayload(domain, types, value);

    // todo: use provider instead of window.ethereum as only browser wallets support it.
    // todo: refactor sovryn-monorepo a lot!
    return await signData(window.ethereum, this.trader, payload);
  }

  async toArgs(chainId: number) {
    const { v, r, s } =
      this.v && this.r && this.s
        ? { v: this.v, r: this.r, s: this.s }
        : await this.sign(chainId);

    return [
      this.loanId,
      this.leverageAmount,
      this.loanTokenAddress,
      this.loanTokenSent,
      this.collateralTokenSent,
      this.collateralTokenAddress,
      this.trader,
      this.minReturn,
      this.loanDataBytes,
      this.deadline,
      this.createdTimestamp,
      v,
      r,
      s,
    ];
  }
}
