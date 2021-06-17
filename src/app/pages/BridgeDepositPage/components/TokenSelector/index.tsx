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
import { BridgeNetworkDictionary } from '../../dictionaries/bridge-network-dictionary';
import { SelectBox } from '../SelectBox';

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

  // todo this will be used for withdrawals later.
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

  const network = useMemo(() => BridgeNetworkDictionary.get(chain as Chain), [
    chain,
  ]);

  return (
    <div>
      <div className="tw-mb-20 tw-text-2xl tw-text-center">
        Select stablecoin to deposit
      </div>
      {sourceAssets.length > 0 ? (
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
      ) : (
        <p>
          Sorry, no supported deposit tokens for {targetAsset} on{' '}
          {network?.name} network. Try choosing another network or token.
        </p>
      )}
    </div>
  );
}
