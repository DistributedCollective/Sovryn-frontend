import { useEffect, useMemo, useState } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import {
  defaultValue,
  WithdrawContextStateType,
} from '../contexts/withdraw-context';
import { getFastBTCWithdrawalContract } from '../helpers';

export function useWithdrawBridgeConfig(network: Chain = Chain.RSK) {
  const [state, setState] = useState<WithdrawContextStateType>(defaultValue);

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      limits: { ...prevState.limits, loading: true },
    }));

    const { address, abi } = getContract('fastBtcBridge');

    bridgeNetwork
      .call(Chain.RSK, address, abi, 'currentFeeStructureIndex', [])
      .then(feeStructureIndex => {
        bridgeNetwork
          .multiCall<{
            minTransferSatoshi: number;
            maxTransferSatoshi: number;
            feeStructures: { baseFeeSatoshi: number; dynamicFee: number };
          }>(Chain.RSK, [
            {
              address,
              abi,
              fnName: 'minTransferSatoshi',
              key: 'minTransferSatoshi',
              args: [],
              parser: value => value[0],
            },
            {
              address,
              abi,
              fnName: 'maxTransferSatoshi',
              key: 'maxTransferSatoshi',
              args: [],
              parser: value => value[0],
            },
            {
              address,
              abi,
              fnName: 'feeStructures',
              key: 'feeStructures',
              args: [feeStructureIndex],
              parser: ({ baseFeeSatoshi, dynamicFee }) => ({
                baseFeeSatoshi,
                dynamicFee,
              }),
            },
          ])
          .then(({ returnData }) => {
            setState(prevState => ({
              ...prevState,
              limits: {
                min: returnData.minTransferSatoshi,
                max: returnData.maxTransferSatoshi,
                baseFee: returnData.feeStructures.baseFeeSatoshi,
                dynamicFee: returnData.feeStructures.dynamicFee,
                loading: false,
              },
            }));
          });
      })
      .catch(error => {
        console.error(error);
        setState(prevState => ({
          ...prevState,
          limits: { ...prevState.limits, loading: false },
        }));
      });

    //
    if (network !== Chain.RSK) {
      setState(prevState => ({
        ...prevState,
        aggregatorLimits: { ...prevState.aggregatorLimits, loading: true },
      }));
      const allowTokens = getFastBTCWithdrawalContract(
        Chain.RSK,
        'aggregatorAllowTokens',
      );
      const basset = getFastBTCWithdrawalContract(Chain.RSK, 'btcWrapperToken');

      bridgeNetwork
        .multiCall<{
          getFeePerToken: number;
          getMinPerToken: number;
        }>(Chain.RSK, [
          {
            address: allowTokens.address,
            abi: allowTokens.abi,
            fnName: 'getFeePerToken',
            key: 'getFeePerToken',
            args: [basset.address],
            parser: value => value[0].toNumber(),
          },
          {
            address: allowTokens.address,
            abi: allowTokens.abi,
            fnName: 'getMinPerToken',
            key: 'getMinPerToken',
            args: [basset.address],
            parser: value => value[0].toNumber(),
          },
        ])
        .then(({ returnData }) => {
          setState(prevState => ({
            ...prevState,
            aggregatorLimits: {
              ...prevState.aggregatorLimits,
              fee: returnData.getFeePerToken,
              min: returnData.getMinPerToken,
              loading: false,
            },
          }));
        })
        .catch(error => {
          console.error(error);
          setState(prevState => ({
            ...prevState,
            aggregatorLimits: { ...prevState.aggregatorLimits, loading: false },
          }));
        });
    }
  }, [network]);

  return useMemo(
    () => ({
      ...state,
      set: setState,
    }),
    [state, setState],
  );
}
