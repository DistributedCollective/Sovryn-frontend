import { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { Asset } from 'types/asset';
import {
  getLendingContract,
  getLendingContractName,
} from 'utils/blockchain/contract-helpers';
import { ethGenesisAddress } from '../../../utils/classifiers';
import { Nullable } from '../../../types';
import { contractReader } from '../../../utils/sovryn/contract-reader';

export function useLending_balanceOf(asset: Asset, owner: string) {
  const [value, setValue] = useState<{
    value: string;
    loading: boolean;
    error: Nullable<string>;
  }>({ value: '0', loading: false, error: null });

  useEffect(() => {
    const run = async () => {
      const balance: string = await contractReader.call(
        getLendingContractName(asset),
        'balanceOf',
        [owner],
      );
      const balanceOfLM: string = await contractReader.call(
        'liquidityMiningProxy',
        'getUserPoolTokenBalance',
        [getLendingContract(asset).address, owner],
      );
      console.log({ balance, balanceOfLM });
      return bignumber(balance).add(balanceOfLM).toString();
    };

    if (!owner || owner === ethGenesisAddress) {
      setValue(prevState => ({
        ...prevState,
        loading: false,
        value: '0',
        error: null,
      }));
      return;
    }

    setValue(prevState => ({ ...prevState, loading: true }));
    run()
      .then(result =>
        setValue(prevState => ({
          ...prevState,
          value: result,
          loading: false,
          error: null,
        })),
      )
      .catch(error =>
        setValue(prevState => ({
          ...prevState,
          value: '0',
          loading: false,
          error: error,
        })),
      );
  }, [asset, owner]);

  return value;
}
