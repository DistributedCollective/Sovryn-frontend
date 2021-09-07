import React from 'react';
import { useTranslation } from 'react-i18next';

import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { translations } from 'locales/i18n';

import { MainSection, Divider } from '../../styled';

import { RewardsDetail, RewardsDetailColor } from '../RewardsDetail';

export function FeesEarnedTab() {
  const { t } = useTranslation();

  const { value: amountToClaim } = useCacheCallWithValue(
    'feeSharingProxy',
    'getAccumulatedFees',
  );

  return (
    <div className="tw-flex tw-flex-col tw-w-full tw-justify-center tw-items-center">
      <MainSection>
        <div className="tw-w-1/2 tw-flex tw-justify-center tw-align-center"></div>
        <Divider />
        <div className="tw-w-1/2 tw-flex tw-justify-center">
          <RewardsDetail
            color={RewardsDetailColor.Yellow}
            title={t(translations.rewardPage.fee.stakingFee)}
            availableAmount={amountToClaim}
            totalEarnedAmount={73.5927}
            isInMainSection
          />
        </div>
      </MainSection>
    </div>
  );
}
