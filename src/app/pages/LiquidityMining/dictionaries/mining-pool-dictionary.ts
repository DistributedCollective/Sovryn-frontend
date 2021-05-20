import { Asset, ChainId } from 'types';
import { PoolDetails } from '../types/pool-details';

/**
 * @deprecated
 */
export class MiningPoolDictionary {
  public static pools: PoolDetails[] = [
    new PoolDetails(
      Asset.SOV,
      Asset.RBTC,
      new Map<ChainId, string>([
        [ChainId.RSK_TESTNET, ''],
        [ChainId.RSK_TESTNET, ''],
      ]),
    ),
    new PoolDetails(
      Asset.USDT,
      Asset.RBTC,
      new Map<ChainId, string>([
        [ChainId.RSK_TESTNET, ''],
        [ChainId.RSK_TESTNET, ''],
      ]),
    ),
    // new PoolDetails(
    //   Asset.ETH,
    //   Asset.RBTC,
    //   new Map<ChainId, string>([
    //     [ChainId.RSK_TESTNET, ''],
    //     [ChainId.RSK_TESTNET, ''],
    //   ]),
    // ),
    new PoolDetails(
      Asset.DOC,
      Asset.RBTC,
      new Map<ChainId, string>([
        [ChainId.RSK_TESTNET, ''],
        [ChainId.RSK_TESTNET, ''],
      ]),
    ),
    new PoolDetails(
      Asset.BPRO,
      Asset.RBTC,
      new Map<ChainId, string>([
        [ChainId.RSK_TESTNET, ''],
        [ChainId.RSK_TESTNET, ''],
      ]),
    ),
  ];
}
