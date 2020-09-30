import Rsk from '@rsksmart/rsk3';
import bzxAbi from './abi/bzxAbi.json';
import priceFeedsAbi from './abi/priceFeedAbi.json';
import LiquidityPoolV2Converter from './abi/LiquidityPoolV2Converter.json';
import tokenAbi from './abi/abiTestToken.json';

export const appContracts = {
  sovrynProtocol: {
    address: Rsk.utils.toChecksumAddress(
      '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7',
    ),
    abi: bzxAbi,
  },
  // AMM liquidity protocol
  liquidityProtocol: {
    address: Rsk.utils.toChecksumAddress(
      '0xd715192612F03D20BaE53a5054aF530C9Bb0fA3f',
    ),
    abi: LiquidityPoolV2Converter,
  },
  priceFeed: {
    address: Rsk.utils.toChecksumAddress(
      '0x437AC62769f386b2d238409B7f0a7596d36506e4',
    ),
    abi: priceFeedsAbi,
  },
  BTC_poolToken: {
    address: Rsk.utils.toChecksumAddress(
      '0x840437bDe7346EC13b5451417DF50586f4DAf836',
    ),
    abi: tokenAbi,
  },
  DOC_poolToken: {
    address: Rsk.utils.toChecksumAddress(
      '0x2dC80332C19Fbcd5169aB4A579D87EE006cb72c0',
    ),
    abi: tokenAbi,
  },
};
