import sovIcon from './icons/sov.svg';
import ethIcon from './icons/eth.svg';
import usdtIcon from './icons/usdt.svg';
import usdcIcon from './icons/usdc.svg';
import daiIcon from './icons/dai.svg';
import { AssetModel } from '../../types/asset-model';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';

// @dev older version of xusd aggregator 0xca8b437d9d586b938CE000e765476A0594856b51
export const xusdAggregatorRSK = '0x1572D7E4a78A8AD14AE722E6fE5f5600a2c7A149';
export const ethsAggregatorRSK = '0x04D92DaA8f3Ef7bD222195e8D1DbE8D89A8CebD3';

const ethToRskTestnetAssets = [
  new AssetModel(
    CrossBridgeAsset.ESOV,
    'eSOV',
    sovIcon,
    18,
    4,
    '0xce887e72f26b61c3ddf45bd6e65abbd58437ab04',
    false,
    CrossBridgeAsset.SOV,
    false,
  ),
  new AssetModel(
    CrossBridgeAsset.ETH,
    'ETH',
    ethIcon,
    18,
    4,
    '0xa1F7EfD2B12aBa416f1c57b9a54AC92B15C3A792',
    true,
    CrossBridgeAsset.ETHS,
    true,
    true,
    ethsAggregatorRSK,
    undefined, // undefined means same as tokenContractAddress param
    [CrossBridgeAsset.ETHS],
  ),
  new AssetModel(
    CrossBridgeAsset.USDT,
    'USDT',
    usdtIcon,
    6,
    4,
    '0xff364ffa4962cb172203a5be01d17cf3fef02419',
    false,
    CrossBridgeAsset.XUSD,
    true,
    true,
    xusdAggregatorRSK,
    undefined, // undefined means same as tokenContractAddress param
    [CrossBridgeAsset.XUSD],
  ),
  new AssetModel(
    CrossBridgeAsset.USDC,
    'USDC',
    usdcIcon,
    6,
    4,
    '0x4C68058992b8aD1243eE23A5923023C0e15Cf43F',
    false,
    CrossBridgeAsset.XUSD,
    true,
    true,
    xusdAggregatorRSK,
    undefined, // undefined means same as tokenContractAddress param
    [CrossBridgeAsset.XUSD],
  ),
  new AssetModel(
    CrossBridgeAsset.DAI,
    'DAI',
    daiIcon,
    18,
    4,
    '0x974cf21396D4D29F8e63Ac07eCfcbaB51a739bc9',
    false,
    CrossBridgeAsset.XUSD,
    true,
    true,
    xusdAggregatorRSK,
    undefined, // undefined means same as tokenContractAddress param
    [CrossBridgeAsset.XUSD],
  ),
];

export default ethToRskTestnetAssets;
