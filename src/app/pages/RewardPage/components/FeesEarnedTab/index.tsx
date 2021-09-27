import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { translations } from 'locales/i18n';
import styles from '../../index.module.scss';
import { RewardsDetail, RewardsDetailColor } from '../RewardsDetail';
import { useAccount } from 'app/hooks/useAccount';
import { getContract } from 'utils/blockchain/contract-helpers';
import { FeesEarnedClaimForm } from '../ClaimForms/FeesEarnedClaimForm/index';
import { useGetContractPastEvents } from 'app/hooks/useGetContractPastEvents';
import { bignumber } from 'mathjs';

export function FeesEarnedTab() {
  const { t } = useTranslation();

  const address = useAccount();

  const { value: amountToClaim } = useCacheCallWithValue(
    'feeSharingProxy',
    'getAccumulatedFees',
    '0',
    address,
    getContract('RBTC_lending').address,
  );

  const { events: feesEarnedEvents } = useGetContractPastEvents(
    'feeSharingProxy',
    'UserFeeWithdrawn',
  );

  const totalRewardsEarned = useMemo(
    () =>
      feesEarnedEvents
        .filter(
          item =>
            item.returnValues.token === getContract('RBTC_lending').address,
        )
        .map(item => item.returnValues.amount)
        .reduce((prevValue, curValue) => prevValue.add(curValue), bignumber(0)),
    [feesEarnedEvents],
  );

  return (
    <div className="tw-flex tw-flex-col tw-w-full tw-justify-center tw-items-center">
      <div className={styles['tab-main-section']}>
        <div className="tw-w-1/2 tw-flex tw-justify-center tw-align-center">
          <FeesEarnedClaimForm amountToClaim={amountToClaim} />
        </div>
        <div className={styles.divider} />
        <div className="tw-w-1/2 tw-flex tw-justify-center">
          <RewardsDetail
            color={RewardsDetailColor.Yellow}
            title={t(translations.rewardPage.fee.stakingFee)}
            availableAmount={amountToClaim}
            totalEarnedAmount={totalRewardsEarned}
            isInMainSection
          />
        </div>
      </div>
    </div>
  );
}
