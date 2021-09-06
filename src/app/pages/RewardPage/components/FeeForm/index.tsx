import React from 'react';
import { useTranslation } from 'react-i18next';

import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { translations } from 'locales/i18n';

import { Box, ContainerBox, Divider, RewardDetailsWrapper } from '../../styled';

import { RewardsDetail, RewardsDetailColor } from '../RewardsDetail';

export function FeeForm() {
  const { t } = useTranslation();

  const { value: amountToClaim } = useCacheCallWithValue(
    'feeSharingProxy',
    'getAccumulatedFees',
  );

  return (
    <ContainerBox>
      <Box>
        <div className="tw-w-1/2 tw-flex tw-justify-center tw-align-center"></div>
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
