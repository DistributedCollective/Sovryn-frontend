import { ILimitOrder } from 'app/pages/SpotTradingPage/types';
import { utils } from 'ethers';
import { _TypedDataEncoder } from 'ethers/lib/utils';
import {
  getContract,
  getTokenContract,
} from '../../../utils/blockchain/contract-helpers';
import type { Asset } from '../../../types';
import { signData } from 'eth-permit/dist/rpc';

export class Order {
  static ORDER_TYPEHASH =
    '0xd6dcdb8a8034d5997072fdf38e109521eb631713bc0470668aa787bb502b623c';

  readonly fromToken: string;
  readonly toToken: string;

  constructor(
    readonly maker: string,
    fromAsset: Asset,
    toAsset: Asset,
    readonly amountIn: string,
    readonly amountOutMin: string,
    readonly recipient: string = maker,
    readonly deadline: string,
    readonly created: string,
    readonly v?: number,
    readonly r?: string,
    readonly s?: string,
  ) {
    this.fromToken = getTokenContract(fromAsset).address;
    this.toToken = getTokenContract(toAsset).address;
  }

  hash(overrides?: ILimitOrder) {
    return utils.keccak256(
      utils.defaultAbiCoder.encode(
        [
          'bytes32',
          'address',
          'address',
          'address',
          'uint256',
          'uint256',
          'address',
          'uint256',
          'uint256',
        ],
        [
          Order.ORDER_TYPEHASH,
          overrides?.maker || this.maker,
          overrides?.fromToken || this.fromToken,
          overrides?.toToken || this.toToken,
          overrides?.amountIn || this.amountIn,
          overrides?.amountOutMin || this.amountOutMin,
          overrides?.recipient || this.recipient,
          overrides?.deadline || this.deadline,
          overrides?.created || this.created,
        ],
      ),
    );
  }

  async sign(chainId: number) {
    const domain = {
      name: 'OrderBook',
      version: '1',
      chainId,
      verifyingContract: getContract('orderBook').address,
    };
    const types = {
      Order: [
        { name: 'maker', type: 'address' },
        { name: 'fromToken', type: 'address' },
        { name: 'toToken', type: 'address' },
        { name: 'amountIn', type: 'uint256' },
        { name: 'amountOutMin', type: 'uint256' },
        { name: 'recipient', type: 'address' },
        { name: 'deadline', type: 'uint256' },
        { name: 'created', type: 'uint256' },
      ],
    };
    const value = {
      maker: this.maker,
      fromToken: this.fromToken,
      toToken: this.toToken,
      amountIn: this.amountIn,
      amountOutMin: this.amountOutMin,
      recipient: this.recipient,
      deadline: this.deadline,
      created: this.created,
    };

    const payload = _TypedDataEncoder.getPayload(domain, types, value);

    // todo: use provider instead of window.ethereum as only browser wallets support it.
    // todo: refactor sovryn-monorepo a lot!
    return await signData(window.ethereum, this.maker, payload);
  }

  async toArgs(chainId: number) {
    const { v, r, s } =
      this.v && this.r && this.s
        ? { v: this.v, r: this.r, s: this.s }
        : await this.sign(chainId);

    return [
      this.maker,
      this.fromToken,
      this.toToken,
      this.amountIn,
      this.amountOutMin,
      this.recipient,
      this.deadline,
      this.created,
      v,
      r,
      s,
    ];
  }
}
