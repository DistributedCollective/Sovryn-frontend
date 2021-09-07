import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';

import { useGetContractPastEvents } from '../../../../hooks/useGetContractPastEvents';
import { LiquidClaimForm } from '../ClaimForms/LiquidClaimForm';
import { MainSection, Divider } from '../../styled';
import { RewardsDetail, RewardsDetailColor } from '../RewardsDetail';
import { bignumber } from 'mathjs';

interface ILiquidTabProps {
  amountToClaim: string;
}

export const LiquidTab: React.FC<ILiquidTabProps> = ({ amountToClaim }) => {
  const { t } = useTranslation();

  const { events: stakingRewardEvents } = useGetContractPastEvents(
    'stakingRewards',
    'RewardWithdrawn',
  );

  const totalRewardsEarned = useMemo(
    () =>
      stakingRewardEvents
        .map(item => item.returnValues.amount)
        .reduce((prevValue, curValue) => prevValue.add(curValue), bignumber(0)),
    [stakingRewardEvents],
  );

  return (
    <div className="tw-flex tw-flex-col tw-w-full tw-justify-center tw-items-center">
      <MainSection>
        <div className="tw-w-1/2 tw-flex tw-justify-center tw-align-center">
          <LiquidClaimForm amountToClaim={amountToClaim} />
        </div>
        <Divider />
        <div className="tw-w-1/2 tw-flex tw-justify-center">
          <RewardsDetail
            color={RewardsDetailColor.Grey}
            title={t(translations.rewardPage.topData.stakingReward)}
            availableAmount={amountToClaim}
            totalEarnedAmount={totalRewardsEarned}
            isInMainSection
          />
        </div>
      </MainSection>
    </div>
  );
};
