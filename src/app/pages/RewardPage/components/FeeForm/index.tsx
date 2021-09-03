import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAccount } from 'app/hooks/useAccount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { translations } from 'locales/i18n';

import { Box, ContainerBox, Divider, RewardDetailsWrapper } from '../../styled';
import { ClaimForm } from '../ClaimForm';
import { RewardsDetail, RewardsDetailColor } from '../RewardsDetail';

export function FeeForm() {
  const userAddress = useAccount();
  const { t } = useTranslation();

  const { value: amountToClaim } = useCacheCallWithValue(
    'feeSharingProxy',
    'getAccumulatedFees',
  );

  return (
    <ContainerBox>
      <Box>
        <div className="tw-w-1/2 tw-flex tw-justify-center tw-align-center">
          <ClaimForm address={userAddress} />
        </div>
        <Divider />
        <div className="tw-w-1/2">TBD</div>
      </Box>
      <RewardDetailsWrapper>
        <RewardsDetail
          color={RewardsDetailColor.Yellow}
          title={t(translations.rewardPage.fee.stakingFee)}
          availableAmount={amountToClaim}
          totalEarnedAmount={73.5927}
        />
      </RewardDetailsWrapper>
    </ContainerBox>
  );
}
