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
import { SelectBox } from '../SelectBox';

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
      <div className="tw-mb-20 tw-text-2xl tw-text-center">
        Select stablecoin to deposit ({targetAsset})
      </div>
      <div className="tw-flex tw-gap-10 tw-px-2 tw-justify-center">
        {sourceAssets.map(item => (
          <SelectBox
            key={item.asset}
            onClick={() => selectSourceAsset(item.asset)}
          >
            <img
              src={item.image}
              alt={item.symbol}
              className="tw-w-14 tw-h-14 tw-mb-5 tw-mt-2"
            />
            {item.symbol}
          </SelectBox>
        ))}
      </div>
    </div>
  );
}
