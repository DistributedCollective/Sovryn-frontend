import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styles from '../../index.module.scss';
import { RewardsDetail, RewardsDetailColor } from '../RewardsDetail';
import { bignumber } from 'mathjs';
import { Asset } from 'types';
import imgNoClaim from 'assets/images/reward/ARMANDO__LENDING.svg';
import { NoRewardInfo } from '../NoRewardInfo';
import { IEarnedFee } from '../../hooks/useGetFeesEarnedClaimAmount';
import { FeesEarnedClaimRow } from '../ClaimForms/FeesEarnedClaimRow';
import { useGetFeesEarnedEvents } from '../../hooks/useGetFeesEarnedEvents';
import { AssetRenderer } from 'app/components/AssetRenderer';

interface IFeesEarnedTabProps {
  amountToClaim: string;
  earnedFees: IEarnedFee[];
  loading?: boolean;
}

export const FeesEarnedTab: React.FC<IFeesEarnedTabProps> = ({
  amountToClaim,
  earnedFees,
  loading = false,
}) => {
  const { t } = useTranslation();

  const { data, loading: totalAmountLoading } = useGetFeesEarnedEvents();

  const totalAmount = useMemo(() => {
    return data?.stakeHistoryItems.reduce(
      (previousItem, currentItem) => previousItem.add(currentItem?.amount || 0),
      bignumber(0),
    );
  }, [data]);

  const totalRewardsEarned = useMemo(
    () => totalAmount?.add(amountToClaim).toString() || 0,
    [totalAmount, amountToClaim],
  );

  return (
    <div className="tw-flex tw-flex-col tw-w-full tw-justify-center tw-items-center">
      <div className={styles['tab-main-section']}>
        {bignumber(amountToClaim).equals(0) ? (
          <NoRewardInfo image={imgNoClaim} text={<NoRewardInfoText />} />
        ) : (
          <div className="tw-table">
            <table className="tw-mx-auto tw-my-4">
              <thead>
                <tr>
                  <th>
                    {t(translations.rewardPage.feesEarnedClaimForm.asset)}
                  </th>
                  <th>
                    {t(translations.rewardPage.feesEarnedClaimForm.amount)}
                  </th>
                  <th>
                    <div className="tw-flex tw-items-center">
                      <div className="tw-w-2 tw-h-2 tw-mr-2 tw-bg-primary"></div>

                      <Trans
                        i18nKey={
                          translations.rewardPage.feesEarnedClaimForm.assetValue
                        }
                        components={[
                          <AssetRenderer
                            assetClassName="tw-mr-1"
                            asset={Asset.RBTC}
                          />,
                        ]}
                      />
                    </div>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {earnedFees.map(earnedFee => (
                  <FeesEarnedClaimRow
                    amountToClaim={earnedFee.value}
                    contractAddress={earnedFee.contractAddress}
                    asset={earnedFee.asset}
                    rbtcValue={earnedFee.rbtcValue}
                    loading={loading}
                    key={earnedFee.contractAddress}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="tw-w-full tw-flex tw-flex-row tw-justify-center tw-gap-x-4 tw-items-center tw-mt-8">
        <RewardsDetail
          color={RewardsDetailColor.Yellow}
          title={t(translations.rewardPage.fee.stakingFee)}
          availableAmount={amountToClaim}
          totalEarnedAmount={totalRewardsEarned}
          asset={Asset.RBTC}
          loading={totalAmountLoading}
          showApproximateSign
        />
        <RewardsDetail
          color={RewardsDetailColor.Grey}
          title={t(translations.rewardPage.referralReward)}
          availableAmount={0}
          totalEarnedAmount={0}
          asset={Asset.RBTC}
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
        {t(translations.rewardPage.noRewardInfoText.feesEarnedTab.title)}
      </div>
      <div className="tw-text-xs tw-tracking-normal tw-font-normal tw-mb-5">
        {t(
          translations.rewardPage.noRewardInfoText.feesEarnedTab
            .recommendationsTitle,
        )}
      </div>
      <div className="tw-text-sm">
        <div className={styles.ul}>
          {t(
            translations.rewardPage.noRewardInfoText.feesEarnedTab
              .recommendation1,
          )}
        </div>
        <div className={styles.ul}>
          {t(
            translations.rewardPage.noRewardInfoText.feesEarnedTab
              .recommendation3,
          )}
        </div>
      </div>
    </>
  );
};
