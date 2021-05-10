import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { Text } from '@blueprintjs/core';

import { NextSupplyInterestRate } from 'app/components/NextSupplyInterestRate';
import { NextBorrowInterestRate } from 'app/components/NextBorrowInterestRate';
import { LendingPool } from 'utils/models/lending-pool';
import { translations } from 'locales/i18n';

import '../../assets/index.scss';
import './style.scss';
import { LoanTokenGraphs } from '../../../../components/LoanTokenGraphs';
import { AssetRenderer } from '../../../../components/AssetRenderer';

type Props = {
  lendingPool: LendingPool;
  lendingAmount: string;
  borrowAmount: string;
  active: boolean;
};

const CurrencyRow: React.FC<Props> = ({
  lendingPool,
  lendingAmount,
  borrowAmount,
  active,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        'sovryn-border tw-overflow-hidden tw-pb-0 tw-pt-1 lg:tw-pt-2 currency-container tw-mb-4 tw-text-muted',
        active && 'currency-container__active',
      )}
    >
      <div className="tw-flex tw-flex- tw-justify-start tw-items-center currency currency-title lg:tw-w-3/6 tw-mb-4 lg:tw-mb-0 tw-px-4">
        <StyledImage src={lendingPool.getAssetDetails().logoSvg} />
        <h3 className="tw-m-0 tw-pb-2">
          <AssetRenderer asset={lendingPool.getAsset()} />
        </h3>
      </div>
      <div className="tw-flex currency tw-pt-0 tw-pb-4 lg:tw-pt-4">
        <div className="tw-w-3/6 tw-px-4">
          <Text className="tw-text-muted">
            {t(translations.lend.currency.lendArp)}:
          </Text>
          <NextSupplyInterestRate
            asset={lendingPool.getAsset()}
            weiAmount={lendingAmount}
          />
        </div>
        <div className="tw-w-3/6 tw-px-4">
          <Text className="tw-text-muted">
            {t(translations.lend.currency.borrowArp)}:
          </Text>
          <NextBorrowInterestRate
            asset={lendingPool.getAsset()}
            weiAmount={borrowAmount}
          />
        </div>
      </div>
      {active && (
        <div>
          <LoanTokenGraphs lendingPool={lendingPool} />
        </div>
      )}
    </div>
  );
};

export default CurrencyRow;

const StyledImage = styled.img`
  width: 44px;
  height: 44px;
  object-fit: scale-down;
  margin-right: 11px;
`;
