import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StyledTable } from './StyledTable';
import { VestingContract } from './VestingContract';
import { useListOfUserVestings } from '../../../components/UserAssets/Vesting/useListOfUserVestings';
import { VestGroup } from 'app/components/UserAssets/Vesting/types';

interface ICurrentVestsProps {
  onDelegate: (
    timestamp: number,
    vestingAddress: string,
    vestingType: VestGroup,
  ) => void;
  paused?: boolean;
  frozen?: boolean;
}

export const CurrentVests: React.FC<ICurrentVestsProps> = ({
  onDelegate,
  paused,
  frozen,
}) => {
  const { t } = useTranslation();
  const { loading, items } = useListOfUserVestings();

  return (
    <>
      <p className="tw-font-semibold tw-text-lg tw-mb-4 tw-mt-6">
        {t(translations.stake.currentVests.title)}
      </p>
      <div className="tw-bg-gray-1 tw-rounded-b tw-shadow">
        <div className="tw-rounded-lg sovryn-table tw-pt-1 tw-mb-5 max-h-96 tw-overflow-y-auto tw-pb-4">
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
                    onDelegate(timestamp, item.vestingContract, item.type)
                  }
                  paused={paused}
                  frozen={frozen}
                />
              ))}
            </tbody>
          </StyledTable>
        </div>
      </div>
    </>
  );
};
