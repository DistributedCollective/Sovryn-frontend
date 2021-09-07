import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Wrapper, SecondarySection, SecondaryTitle } from './styled';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { Tooltip } from '@blueprintjs/core';
import { weiToNumberFormat } from 'utils/display-text/format';

export enum RewardsDetailColor {
  Grey = 'grey',
  Green = 'green',
  Yellow = 'yellow',
}

interface IRewardsDetailProps {
  color: RewardsDetailColor;
  title: string;
  availableAmount: number | string;
  totalEarnedAmount: number | string;
  isInMainSection?: boolean;
}

const getDetailColor = (color: RewardsDetailColor): string => {
  switch (color) {
    case RewardsDetailColor.Grey:
      return 'tw-bg-white';
    case RewardsDetailColor.Green:
      return 'tw-bg-green-2';
    case RewardsDetailColor.Yellow:
      return 'tw-bg-primary';
    default:
      return 'tw-bg-white';
  }
};

export const RewardsDetail: React.FC<IRewardsDetailProps> = ({
  color,
  title,
  availableAmount,
  totalEarnedAmount,
  isInMainSection,
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper isInMainSection={isInMainSection}>
      <div className="tw-text-xl tw-font-medium tw-mb-8">{title}</div>

      <div className="tw-mb-6">
        <div className="tw-flex tw-items-center tw-mb-1.5">
          <div className={`tw-w-3 tw-h-3 tw-mr-4 ${getDetailColor(color)}`} />
          <div className="tw-text-xs">
            {t(translations.rewardPage.availableRewards)}
          </div>
        </div>
        <div className="tw-ml-7 tw-text-xl tw-font-medium">
          <Tooltip content={`${weiTo18(availableAmount)} SOV`}>
            <>
              {weiToNumberFormat(availableAmount, 6)}{' '}
              <span className="tw--ml-1 tw-mr-1">...</span> SOV
            </>
          </Tooltip>
        </div>
      </div>
      <SecondarySection>
        <SecondaryTitle>
          {t(translations.rewardPage.totalRewards)}
        </SecondaryTitle>
        <Tooltip content={`${weiTo18(totalEarnedAmount)} SOV`}>
          <>
            {weiToNumberFormat(totalEarnedAmount, 6)}{' '}
            <span className="tw--ml-1 tw-mr-1">...</span> SOV
          </>
        </Tooltip>
      </SecondarySection>
    </Wrapper>
  );
};
