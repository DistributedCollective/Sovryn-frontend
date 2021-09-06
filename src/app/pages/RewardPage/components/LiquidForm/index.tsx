import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccount } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';

import { useGetContractPastEvents } from '../../../../hooks/useGetContractPastEvents';
import { LiquidClaimForm } from '../ClaimForms/LiquidClaimForm';
import { Box, ContainerBox, Divider, RewardDetailsWrapper } from '../../styled';
import { RewardsDetail, RewardsDetailColor } from '../RewardsDetail';
import { bignumber } from 'mathjs';

interface ILiquidFormProps {
  amountToClaim: string;
}

export const LiquidForm: React.FC<ILiquidFormProps> = ({ amountToClaim }) => {
  const userAddress = useAccount();
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
    <ContainerBox>
      <Box>
        <div className="tw-w-1/2 tw-flex tw-justify-center tw-align-center">
          <LiquidClaimForm
            address={userAddress}
            amountToClaim={amountToClaim}
          />
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
      </Box>
    </ContainerBox>
  );
};
