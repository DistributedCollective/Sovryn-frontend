/**
 *
 * BridgeDepositPage
 *
 */

import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Chain } from 'types';

import { actions } from '../../slice';
import { selectBridgeDepositPage } from '../../selectors';
import { BridgeDictionary } from '../../dictionaries/bridge-dictionary';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';

interface Props {}

export function TokenSelector(props: Props) {
  const { chain, targetChain, targetAsset } = useSelector(
    selectBridgeDepositPage,
  );
  const dispatch = useDispatch();

  const selectSourceAsset = useCallback(
    (asset: CrossBridgeAsset) => {
      dispatch(actions.selectSourceAsset(asset));
    },
    [dispatch],
  );

  // It excludes current dapp chain (no RSK network), but i think it should be there in the end.
  const sourceAssets = useMemo(
    () =>
      (
        BridgeDictionary.get(chain as Chain, targetChain)?.assets || []
      ).filter(item =>
        item.aggregatedTokens.includes(targetAsset as CrossBridgeAsset),
      ),
    [chain, targetAsset, targetChain],
  );

  return (
    <div>
      <h1>Select Coin to Deposit ({targetAsset})</h1>
      <div className="tw-grid tw-gap-5 tw-grid-cols-4">
        {sourceAssets.map(item => (
          <button
            key={item.asset}
            onClick={() => selectSourceAsset(item.asset)}
            className="tw-p-3 tw-bg-gray-800 hover:tw-bg-gray-900"
          >
            <img src={item.image} alt={item.symbol} className="tw-w-8 tw-h-8" />
            {item.symbol}
          </button>
        ))}
      </div>
    </div>
  );
}
