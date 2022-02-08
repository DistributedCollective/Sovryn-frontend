import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StyledTable } from './StyledTable';
import { VestingContract } from './VestingContract';
import { useListOfUserVestings } from '../../../components/UserAssets/Vesting/useListOfUserVestings';

interface Props {
  onDelegate: (timestamp: number, vestingAddress: string) => void;
}

export function CurrentVests(props: Props) {
  const { t } = useTranslation();
  const { loading, items } = useListOfUserVestings();

  return (
    <>
      <p className="tw-font-semibold tw-text-lg tw-ml-6 tw-mb-4 tw-mt-6">
        {t(translations.stake.currentVests.title)}
      </p>
      <div className="tw-bg-gray-1 tw-rounded-b tw-shadow">
        <div className="tw-rounded-lg tw-border sovryn-table tw-pt-1 tw-pr-5 tw-pl-5 tw-mb-5 max-h-96 tw-overflow-y-auto tw-pb-4">
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
              {items.map(item => (
                <VestingContract
                  key={item.vestingContract}
                  vestingAddress={item.vestingContract}
                  type={item.type}
                  onDelegate={timestamp =>
                    props.onDelegate(timestamp, item.vestingContract)
                  }
                />
              ))}
            </tbody>
          </StyledTable>
        </div>
      </div>
    </>
  );
}
