import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useGetContractPastEvents } from '../../../../hooks/useGetContractPastEvents';
import { LiquidClaimForm } from '../ClaimForms/LiquidClaimForm';
import styles from '../../index.module.scss';
import { RewardsDetail, RewardsDetailColor } from '../RewardsDetail';
import { bignumber } from 'mathjs';
import { PieChart } from '../../styled';
import imgNoClaim from 'assets/images/reward/ARMANDO__LENDING.svg';
import { NoRewardInfo } from '../NoRewardInfo';

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
      <div className={styles['tab-main-section']}>
        {bignumber(amountToClaim).equals(0) ? (
          <NoRewardInfo image={imgNoClaim} text={<NoRewardInfoText />} />
        ) : (
          <>
            <div className="tw-w-1/2 tw-flex tw-justify-center tw-align-center">
              <LiquidClaimForm amountToClaim={amountToClaim} />
            </div>
            <div className={styles.divider} />
            <div className="tw-w-1/2">
              <div className="tw-flex tw-items-center tw-justify-evenly">
                <PieChart
                  firstPercentage={0}
                  secondPercentage={0}
                  thirdPercentage={100}
                />
                <div>
                  <div className="tw-text-xs mb-2 tw-flex tw-items-center tw-mb-5">
                    <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-primary"></div>
                    100% {t(translations.rewardPage.stakingReward)}
                  </div>
                  <div className="tw-text-xs mb-2 tw-flex tw-items-center tw-mb-5">
                    <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-white"></div>
                    0% {t(translations.rewardPage.referralReward)} [
                    {t(translations.rewardPage.comingSoon)}]
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="tw-w-full tw-flex tw-flex-row tw-justify-center tw-gap-x-4 tw-items-center tw-mt-8">
        <RewardsDetail
          color={RewardsDetailColor.Yellow}
          title={t(translations.rewardPage.stakingReward)}
          availableAmount={amountToClaim}
          totalEarnedAmount={totalRewardsEarned}
        />
        <RewardsDetail
          color={RewardsDetailColor.Grey}
          title={t(translations.rewardPage.referralReward)}
          availableAmount={0}
          totalEarnedAmount={0}
          isComingSoon
        />
      </div>
    </div>
  );
};

const NoRewardInfoText: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="tw-text-xl tw-font-medium tw-mb-5 tw-tracking-normal">
        {t(translations.rewardPage.noRewardInfoText.liquidSovTab.title)}
      </div>
      <div className="tw-text-xs tw-tracking-normal tw-font-light tw-mb-5">
        {t(
          translations.rewardPage.noRewardInfoText.liquidSovTab
            .recommendationsTitle,
        )}
      </div>
      <div className="tw-text-sm">
        <div className={styles.ul}>
          {t(
            translations.rewardPage.noRewardInfoText.liquidSovTab
              .recommendation1,
          )}
        </div>
      </div>
    </>
  );
};
