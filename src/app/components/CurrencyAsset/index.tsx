/**
 *
 * CurrencyAssets
 *
 */
import React from 'react';
import styled from 'styled-components/macro';

import { Asset } from 'types/asset';

import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';

interface CurrencyProps {
  assetImg?: any;
  assetSymbol: Asset;
}
const symbolMap = {
  [Asset.RBTC]: 'rBTC',
  [Asset.USDT]: 'rUSDT',
};
// function renderCustomSymbol(currency: string) {
//   return (
//     <div className="d-flex flex-row">
//       <Small>{currency.charAt(0)}</Small>
//       {currency.slice(1)}
//     </div>
//   );
// }
function getAssetSymbol(asset: Asset) {
  if (symbolMap.hasOwnProperty(asset)) {
    return symbolMap[asset];
  }
  return AssetsDictionary.get(asset).symbol;
}
export function CurrencyAssets(props: CurrencyProps) {
  const currency = getAssetSymbol(props.assetSymbol);
  console.log('currency', currency);
  return (
    <>
      <img
        className="d-inline mr-2"
        style={{ height: '40px' }}
        src={props.assetImg}
        alt={props.assetSymbol}
      />{' '}
      {/* abc */}
      {getAssetSymbol(props.assetSymbol)}
    </>
  );
}

const Small = styled.span.attrs(_ => ({
  type: 'span',
}))`
  font-family: 'Montserrat', sans-serif;
  font-weight: 100;
  width: 100%;
  opacity: 50%;
  font-size: 10.5px;
  letter-spacing: 0;
`;
