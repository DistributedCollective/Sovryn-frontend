import { useCallback, useEffect, useState } from 'react';
import { Asset } from 'types/asset';
import {
  getAmmContractName,
  getPoolTokenContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import TokenAbi from 'utils/blockchain/abi/abiTestToken.json';
import { ethGenesisAddress } from 'utils/classifiers';
import { Sovryn } from 'utils/sovryn';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { AbiItem } from 'web3-utils';

export function usePoolToken(pool: Asset, asset: Asset) {
  const { loading, error } = useCacheCallWithValue(
    getAmmContractName(pool),
    'poolToken',
    ethGenesisAddress,
    getTokenContract(asset).address,
  );

  const { value: anchor } = useCacheCallWithValue(
    getAmmContractName(pool),
    'anchor',
    ethGenesisAddress,
  );

  // do not remove, we need this when adding new pools
  useEffect(() => {
    if (anchor !== ethGenesisAddress) {
      // todo: hide console output (show only when flagged, for example using 'debug' package).
      console.log(`${pool}_${asset} v1 poolToken: `, anchor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchor]);

  return { value: useLocalPoolToken(pool, asset), loading, error };
}

export function useLocalPoolToken(pool: Asset, asset: Asset) {
  const getPoolToken = useCallback(() => {
    return LiquidityPoolDictionary.get(pool)
      ?.getPoolAsset(asset)
      ?.getContractAddress() as string;
  }, [pool, asset]);

  const [poolToken, setPoolToken] = useState(getPoolToken());

  useEffect(() => {
    const value = getPoolToken();
    if (value && value !== ethGenesisAddress) {
      const contractName = getPoolTokenContractName(pool, asset);
      if (
        !Sovryn.writeContracts.hasOwnProperty(contractName) &&
        Sovryn.writeContracts[contractName]?.options?.address.toLowerCase() !==
          value.toLowerCase()
      ) {
        Sovryn.addWriteContract(contractName, {
          address: value,
          abi: TokenAbi as AbiItem[],
        });
      }
      if (
        !Sovryn.contracts.hasOwnProperty(contractName) &&
        Sovryn.contracts[contractName]?.options?.address.toLowerCase() !==
          value.toLowerCase()
      ) {
        Sovryn.addReadContract(contractName, {
          address: value,
          abi: TokenAbi as AbiItem[],
        });
      }
    }
    setPoolToken(value);
  }, [pool, asset, getPoolToken]);

  return poolToken;
}
