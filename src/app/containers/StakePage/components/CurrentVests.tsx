import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StyledTable } from './StyledTable';
import { useAccount } from '../../../hooks/useAccount';
import { ethGenesisAddress } from 'utils/classifiers';
import { contractReader } from 'utils/sovryn/contract-reader';
import { VestingContract } from './VestingContract';

interface Props {
  onDelegate: (a: number) => void;
}

export function CurrentVests(props: Props) {
  const { items, loading, error } = useGetItems();
  const { t } = useTranslation();

  return (
    <>
      <p className="tw-font-semibold tw-text-lg tw-ml-6 tw-mb-4 tw-mt-6">
        {t(translations.stake.currentVests.title)}
      </p>
      <div className="tw-bg-gray-light tw-rounded-b tw-shadow">
        <div className="tw-rounded-lg tw-border sovryn-table tw-pt-1 tw-pb-0 tw-pr-5 tw-pl-5 tw-mb-5 max-h-96 tw-overflow-y-auto">
          <StyledTable className="tw-w-full">
            <thead>
              <tr>
                <th className="tw-text-left assets">
                  {t(translations.stake.currentVests.asset)}
                </th>
                <th className="tw-text-left">
                  {t(translations.stake.currentVests.lockedAmount)}
                </th>
                <th className="tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentVests.votingPower)}
                </th>
                <th className="tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentVests.stakingPeriod)}
                </th>
                <th className="tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentVests.stakingDate)}
                </th>
                <th className="tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentVests.fees)}
                </th>
                <th className="tw-text-left tw-hidden md:tw-table-cell">
                  {t(translations.stake.actions.title)}
                </th>
              </tr>
            </thead>
            <tbody className="tw-mt-5 tw-font-montserrat tw-text-xs">
              {loading && !items.length && (
                <tr>
                  <td colSpan={99} className="tw-text-center tw-font-normal">
                    {t(translations.stake.loading)}
                  </td>
                </tr>
              )}
              {!loading && !items.length && (
                <tr>
                  <td colSpan={99} className="tw-text-center tw-font-normal">
                    {t(translations.stake.currentVests.noVestingContracts)}
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
                  onDelegate={props.onDelegate}
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
    items: { address: string; type: 'genesis' | 'origin' | 'team' | 'reward' }[];
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
            type: 'genesis' | 'origin' | 'team' | 'reward';
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

          const vesting4 = (await contractReader.call(
            'vestingRegistry3',
            'getVesting',
            [account],
          )) as string;
          if (vesting4 && vesting4 !== ethGenesisAddress) {
            items.push({ address: vesting4, type: 'reward' });
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
