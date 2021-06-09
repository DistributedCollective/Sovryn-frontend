import { Asset } from 'types/asset';
import {
  LiquidityPool,
  LiquidityPoolSupplyAsset,
} from '../models/liquidity-pool';

export class LiquidityPoolDictionary {
  public static pools: Map<Asset, LiquidityPool> = new Map<
    Asset,
    LiquidityPool
  >([
    [
      Asset.SOV,
      new LiquidityPool(Asset.SOV, [
        new LiquidityPoolSupplyAsset(Asset.SOV, {
          mainnet: '0x09c5faf7723b13434abdf1a65ab1b667bc02a902',
          testnet: '0xdF298421CB18740a7059b0Af532167fAA45e7A98',
        }),
        new LiquidityPoolSupplyAsset(Asset.RBTC, {
          mainnet: '0x542fDA317318eBF1d3DEAf76E0b632741A7e677d', // todo most likely not needed for v1?
          testnet: '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315', // todo most likely not needed for v1?
        }),
      ]).setVersion(1),
    ],
    [
      Asset.XUSD,
      new LiquidityPool(Asset.XUSD, [
        new LiquidityPoolSupplyAsset(Asset.XUSD, {
          mainnet: '0x6f96096687952349DD5944E0EB1Be327DcdeB705',
          testnet: '0x151fB2e01ae09F2a7B8B6588ea792314ac146591',
        }),
        new LiquidityPoolSupplyAsset(Asset.RBTC, {
          mainnet: '0x6f96096687952349DD5944E0EB1Be327DcdeB705',
          testnet: '0x151fB2e01ae09F2a7B8B6588ea792314ac146591',
        }),
      ]).setVersion(1),
    ],
    [
      Asset.USDT,
      new LiquidityPool(Asset.USDT, [
        new LiquidityPoolSupplyAsset(Asset.USDT, {
          mainnet: '0x40580E31cc14DbF7a0859f38Ab36A84262df821D',
          testnet: '0x7274305BB36d66F70cB8824621EC26d52ABe9069',
        }),
        new LiquidityPoolSupplyAsset(Asset.RBTC, {
          mainnet: '0x9c4017D1C04cFa0F97FDc9505e33a0D8ac84817F',
          testnet: '0xfFBBF93Ecd27C8b500Bd35D554802F7F349A1E9B',
        }),
      ]),
    ],
    [
      Asset.ETH,
      new LiquidityPool(Asset.ETH, [
        new LiquidityPoolSupplyAsset(Asset.ETH, {
          mainnet: '0xF41Ed702df2B84AcE02772C6a0D8AE46465aA5F4',
          testnet: '0xBb5B900EDa0F1459F582aB2436EA825a927f5bA2',
        }),
        new LiquidityPoolSupplyAsset(Asset.RBTC, {
          mainnet: '0xF41Ed702df2B84AcE02772C6a0D8AE46465aA5F4',
          testnet: '0xBb5B900EDa0F1459F582aB2436EA825a927f5bA2',
        }),
      ]).setVersion(1),
    ],
    [
      Asset.MOC,
      new LiquidityPool(Asset.MOC, [
        new LiquidityPoolSupplyAsset(Asset.MOC, {
          mainnet: '0x7Fef930ebaA90B2f8619722adc55e3f1D965B79b',
          testnet: '0x6e03DEFD0ae9091Be74f64c8CB9BE319994E5deB',
        }),
        new LiquidityPoolSupplyAsset(Asset.RBTC, {
          mainnet: '0x7Fef930ebaA90B2f8619722adc55e3f1D965B79b',
          testnet: '0x6e03DEFD0ae9091Be74f64c8CB9BE319994E5deB',
        }),
      ]).setVersion(1),
    ],
    [
      Asset.DOC,
      new LiquidityPool(Asset.DOC, [
        new LiquidityPoolSupplyAsset(Asset.DOC, {
          mainnet: '0x2dc80332C19FBCd5169ab4a579d87eE006Cb72c0',
          testnet: '0x6787161bc4F8d54e6ac6fcB9643Af6f4a12DfF28',
        }),
        new LiquidityPoolSupplyAsset(Asset.RBTC, {
          mainnet: '0x840437BdE7346EC13B5451417Df50586F4dAF836',
          testnet: '0x7F433CC76298bB5099c15C1C7C8f2e89A8370111',
        }),
      ]),
    ],
    [
      Asset.DOC,
      new LiquidityPool(Asset.DOC, [
        new LiquidityPoolSupplyAsset(Asset.DOC, {
          mainnet: '0x2dc80332C19FBCd5169ab4a579d87eE006Cb72c0',
          testnet: '0x6787161bc4F8d54e6ac6fcB9643Af6f4a12DfF28',
        }),
        new LiquidityPoolSupplyAsset(Asset.RBTC, {
          mainnet: '0x840437BdE7346EC13B5451417Df50586F4dAF836',
          testnet: '0x7F433CC76298bB5099c15C1C7C8f2e89A8370111',
        }),
      ]),
    ],
    [
      Asset.BPRO,
      new LiquidityPool(Asset.BPRO, [
        new LiquidityPoolSupplyAsset(Asset.BPRO, {
          mainnet: '0x9CE25371426763025C04a9FCd581fbb9E4593475',
          testnet: '0xdaf6FD8370f5245d98E829c766e008cd39E8F060',
        }),
        new LiquidityPoolSupplyAsset(Asset.RBTC, {
          mainnet: '0x75e327A83aD2BFD53da12EB718fCCFC68Bc57535',
          testnet: '0x98e5F39D8C675972A66ea165040Cb81803c440A3',
        }),
      ]),
    ],
  ]);

  public static get(asset: Asset): LiquidityPool {
    return this.pools.get(asset) as LiquidityPool;
  }

  public static list(): Array<LiquidityPool> {
    return Array.from(this.pools.values());
  }

  public static pairTypeList(): Array<Asset> {
    return Array.from(this.pools.keys());
  }

  public static find(pairs: Array<Asset>): Array<LiquidityPool> {
    return pairs.map(asset => this.get(asset));
  }

  public static getPoolAsset(pool: Asset, asset: Asset) {
    return this.get(pool).getPoolAsset(asset);
  }

  public static entries() {
    return Array.from(this.pools.entries());
  }
}
