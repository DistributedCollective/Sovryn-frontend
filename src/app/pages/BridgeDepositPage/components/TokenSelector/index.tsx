/**
 *
 * BridgeDepositPage
 *
 */

import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chain } from 'types';

import { actions } from '../../slice';
import { selectBridgeDepositPage } from '../../selectors';
import { BridgeDictionary } from '../../dictionaries/bridge-dictionary';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';
import { bridgeNetwork } from '../../utils/bridge-network';
import erc20Abi from '../../../../../utils/blockchain/abi/erc20.json';
import { DepositStep } from '../../types';

interface Props {}

export function TokenSelector(props: Props) {
  const { chain, targetChain, targetAsset } = useSelector(
    selectBridgeDepositPage,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (chain === null) {
      dispatch(actions.setStep(DepositStep.CHAIN_SELECTOR));
    }
  }, [chain, dispatch]);

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

  useEffect(() => {
    const callData = sourceAssets
      .filter(item => item.usesAggregator && !item.aggregatorMints)
      .map(item => {
        return {
          address:
            item.bridgeTokenAddresses.get(targetAsset as any) ||
            item.tokenContractAddress,
          abi: erc20Abi,
          fnName: 'balanceOf',
          args: [item.aggregatorContractAddress],
          key: item.symbol,
        };
      });

    if (callData.length) {
      bridgeNetwork
        .multiCall(targetChain as any, callData)
        .then(result => {
          // todo render these balance limits to respected asset (only when chain is RSK)
          console.log('token selector', result);
        })
        .catch(error => {
          console.error('what', error);
        });
    }
  }, [chain, targetChain, targetAsset, sourceAssets]);

  return (
    <div>
      <h1>Select Coin to Deposit</h1>
      {sourceAssets.length > 0 ? (
        <div className="tw-grid tw-gap-5 tw-grid-cols-4">
          {sourceAssets.map(item => (
            <button
              key={item.asset}
              onClick={() => selectSourceAsset(item.asset)}
              className="tw-p-3 tw-bg-gray-800 hover:tw-bg-gray-900"
            >
              <img
                src={item.image}
                alt={item.symbol}
                className="tw-w-8 tw-h-8"
              />
              {item.symbol}
            </button>
          ))}
        </div>
      ) : (
        <p>Sorry, no supported deposit tokens for {targetAsset}.</p>
      )}
    </div>
  );
}
