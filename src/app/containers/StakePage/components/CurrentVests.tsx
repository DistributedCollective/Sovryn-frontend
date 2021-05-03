import React, { useEffect, useState } from 'react';
import { StyledTable } from './StyledTable';
import { useAccount } from '../../../hooks/useAccount';
import { ethGenesisAddress } from 'utils/classifiers';
import { contractReader } from 'utils/sovryn/contract-reader';
import { VestingContract } from './VestingContract';

export function CurrentVests() {
  const { items, loading, error } = useGetItems();
  return (
    <>
      <p className="tw-font-semibold tw-text-lg tw-ml-6 tw-mb-4 tw-mt-6">
        Current Vests
      </p>
      <div className="tw-bg-gray-light tw-rounded-b tw-shadow">
        <div className="tw-rounded-lg tw-border sovryn-table tw-pt-1 tw-pb-0 tw-pr-5 tw-pl-5 tw-mb-5 max-h-96 tw-overflow-y-auto">
          <StyledTable className="tw-w-full">
            <thead>
              <tr>
                <th className="tw-text-left assets">Asset</th>
                <th className="tw-text-left">Locked Amount</th>
                <th className="tw-text-left tw-hidden lg:tw-table-cell">
                  Voting Power
                </th>
                <th className="tw-text-left tw-hidden lg:tw-table-cell">
                  Staking Date
                </th>
                <th className="tw-text-left tw-hidden lg:tw-table-cell">
                  Staking Period
                </th>
                <th className="tw-text-left tw-hidden lg:tw-table-cell">
                  Unlock Date
                </th>
                <th className="tw-text-left tw-hidden md:tw-table-cell max-w-15 min-w-15">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="tw-mt-5 tw-font-montserrat tw-text-xs">
              {loading && !items.length && (
                <tr>
                  <td colSpan={99} className="ttw-ext-center tw-font-normal">
                    Loading, please wait...
                  </td>
                </tr>
              )}
              {!loading && !items.length && (
                <tr>
                  <td colSpan={99} className="tw-text-center tw-font-normal">
                    You don't have any vesting contracts.
                  </td>
                </tr>
              )}
              {!!error && (
                <tr>
                  <td colSpan={99} className="tw-text-center tw-font-normal">
                    {error}
                  </td>
                </tr>
              )}
              {items.map(item => (
                <VestingContract
                  key={item.address}
                  vestingAddress={item.address}
                  type={item.type}
                />
              ))}
            </tbody>
          </StyledTable>
        </div>
      </div>
    </>
  );
}

function useGetItems() {
  const account = useAccount();
  const [state, setState] = useState<{
    items: { address: string; type: 'genesis' | 'origin' | 'team' }[];
    error: string;
    loading: boolean;
  }>({
    items: [],
    error: '',
    loading: false,
  });

  useEffect(() => {
    const run = () =>
      new Promise(async (resolve, reject) => {
        try {
          const items: {
            address: string;
            type: 'genesis' | 'origin' | 'team';
          }[] = [];
          const vesting1 = (await contractReader.call(
            'vestingRegistry',
            'getVesting',
            [account],
          )) as string;
          if (vesting1 && vesting1 !== ethGenesisAddress) {
            items.push({ address: vesting1, type: 'genesis' });
          }

          setState(prevState => ({ ...prevState, items }));

          const vesting2 = (await contractReader.call(
            'vestingRegistry',
            'getTeamVesting',
            [account],
          )) as string;
          if (vesting2 && vesting2 !== ethGenesisAddress) {
            items.push({ address: vesting2, type: 'team' });
            setState(prevState => ({ ...prevState, items }));
          }

          const vesting3 = (await contractReader.call(
            'vestingRegistryOrigin',
            'getVesting',
            [account],
          )) as string;
          if (vesting3 && vesting3 !== ethGenesisAddress) {
            items.push({ address: vesting3, type: 'origin' });
            setState(prevState => ({ ...prevState, items }));
          }

          resolve(items);
        } catch (e) {
          reject(e);
        }
      });

    if (account && account !== ethGenesisAddress) {
      console.log('started loading for ', account);
      setState({ items: [], loading: true, error: '' });
      run()
        .then((value: any) => {
          console.log('loaded for ', account, value);
          setState({ items: value, loading: false, error: '' });
        })
        .catch(e => {
          console.log('errored', account, e);
          setState(prevState => ({
            ...prevState,
            loading: false,
            error: e.message,
          }));
        });
    }
  }, [account]);

  return state;
}
