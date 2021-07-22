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
      let balance: any;
      let balanceOfLM: any;

      try {
        balance = await contractReader.call(
          getLendingContractName(asset),
          'balanceOf',
          [owner],
        );
      } catch (err) {
        console.log(`useLending_balanceOf balanceOf failed`);
      }

      try {
        balanceOfLM = await contractReader.call(
          'liquidityMiningProxy',
          'getUserPoolTokenBalance',
          [getLendingContract(asset).address, owner],
        );
      } catch (err) {
        console.log(`useLending_balanceOf getUserPoolTokenBalance failed`);
      }

      let total: math.BigNumber = bignumber(0);
      if (!isNaN(balance)) total = total.add(balance);
      if (!isNaN(balanceOfLM)) total = total.add(balanceOfLM);

      return total.toString();
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
