/**
 *
 * BridgeDepositPage
 *
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chain } from 'types';

import { actions } from '../../slice';
import { selectBridgeWithdrawPage } from '../../selectors';
import erc20Abi from '../../../../../utils/blockchain/abi/erc20.json';
import { WithdrawStep } from '../../types';
import { toNumberFormat } from 'utils/display-text/format';
import { bignumber } from 'mathjs';
import { LoadableValue } from 'app/components/LoadableValue';
import cn from 'classnames';
import { CrossBridgeAsset } from 'app/pages/BridgeDepositPage/types/cross-bridge-asset';
import { BridgeDictionary } from '../../../BridgeDepositPage/dictionaries/bridge-dictionary';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { BridgeNetworkDictionary } from 'app/pages/BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { AssetModel } from '../../../BridgeDepositPage/types/asset-model';
import { SelectBox } from '../../../BridgeDepositPage/components/SelectBox';

interface Props {}

export function TokenSelector(props: Props) {
  const { chain, targetChain, targetAsset, sourceAsset } = useSelector(
    selectBridgeWithdrawPage,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (chain === null) {
      dispatch(actions.setStep(WithdrawStep.CHAIN_SELECTOR));
    }
  }, [chain, dispatch]);

  const selectTargetAsset = useCallback(
    (asset: CrossBridgeAsset) => {
      dispatch(actions.selectTargetAsset(asset));
    },
    [dispatch],
  );
  const currentAsset = useMemo(
    () =>
      BridgeDictionary.get(chain as Chain, targetChain as Chain)?.getAsset(
        sourceAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, targetChain, sourceAsset],
  );

  const targetAssets = useMemo(
    () =>
      (
        BridgeDictionary.get(targetChain as Chain, chain as Chain)?.assets || []
      ).filter(item => currentAsset?.aggregatedTokens?.includes(item.asset)),
    [chain, currentAsset, targetChain],
  );

  const [balances, setBalances] = useState<
    { key: CrossBridgeAsset; value: string }[]
  >([]);
  // todo this will be used for withdrawals later.
  useEffect(() => {
    const callData = targetAssets.map(item => {
      return {
        address: (
          currentAsset.bridgeTokenAddresses.get(item.asset) ||
          currentAsset.tokenContractAddress
        ).toLowerCase(),
        abi: erc20Abi,
        fnName: 'balanceOf',
        args: [currentAsset.aggregatorContractAddress?.toLowerCase()],
        key: item.symbol,
      };
    });

    if (callData.length) {
      bridgeNetwork
        .multiCall(chain as any, callData)
        .then(({ returnData }) => {
          // todo render these balance limits to respected asset (only when chain is RSK)
          setBalances(
            Object.entries(returnData).map(([key, value]) => ({
              key: key as CrossBridgeAsset,
              value: currentAsset.fromWei((value as any).toString()) || 'x',
            })),
          );
        })
        .catch(error => {
          console.error('what', error);
          setBalances([]);
        });
    }
  }, [chain, targetChain, targetAsset, targetAssets, currentAsset]);

  const network = useMemo(
    () => BridgeNetworkDictionary.get(targetChain as Chain),
    [targetChain],
  );

  const getBalance = (asset: CrossBridgeAsset) =>
    balances.find(item => item.key === asset)?.value || '0';

  return (
    <div>
      <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
        Select stablecoin to withdraw to
      </div>
      {targetAssets.length > 0 ? (
        <div className="tw-flex tw-gap-10 tw-px-2 tw-justify-center">
          {targetAssets.map(item => {
            return (
              <TokenItem
                key={item.asset}
                sourceAsset={item.asset}
                image={item.image}
                symbol={item.symbol}
                balance={getBalance(item.asset)}
                onClick={() => selectTargetAsset(item.asset)}
              />
            );
          })}
        </div>
      ) : (
        <p>
          Sorry, no supported withdraw tokens for {sourceAsset} on{' '}
          {network?.name} network. Try choosing another network or token.
        </p>
      )}
    </div>
  );
}

function TokenItem({ sourceAsset, balance, image, symbol, onClick }) {
  const { chain, targetChain } = useSelector(selectBridgeWithdrawPage);
  const asset = useMemo(
    () =>
      BridgeDictionary.get(targetChain as Chain, chain as Chain)?.getAsset(
        sourceAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, sourceAsset, targetChain],
  );

  const isDisabled = useMemo(() => !bignumber(balance).greaterThan(0), [
    balance,
  ]);

  return (
    <div>
      <SelectBox onClick={onClick} disabled={isDisabled}>
        <img src={image} alt={symbol} className="tw-w-16 tw-h-16" />
      </SelectBox>
      <div
        className={cn('tw-flex tw-flex-col tw-items-center tw-mt-2', {
          'tw-opacity-25': isDisabled && !balance.loading,
        })}
      >
        <span className="tw-text-sm tw-font-light tw-mb-1">
          Available Balance
        </span>
        <LoadableValue
          value={`${toNumberFormat(balance, asset.minDecimals)} ${
            asset.symbol
          }`}
          loading={balance.loading}
        />
      </div>
    </div>
  );
}
