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
        'sovryn-border tw-py-1 lg:tw-py-2 currency-container font-family-work-sans mb-3 text-muted',
        active && 'currency-container__active',
      )}
    >
      <div className="tw-flex tw-flex- tw-justify-start tw-items-center currency currency-title lg:tw-w-6/12 tw-mb-3 lg:tw-mb-0 tw-px-3">
        <StyledImage src={lendingPool.getAssetDetails().logoSvg} />
        <h3 className="tw-m-0 font-family-rowdies">{lendingPool.getName()}</h3>
      </div>
      <div className="tw-flex currency tw-pt-0 lg:tw-w-6/12 lg:tw-pt-3">
        <div className="tw-w-6/12 tw-px-3">
          <Text className="text-muted">
            {t(translations.lend.currency.lendArp)}:
          </Text>
          <NextSupplyInterestRate
            asset={lendingPool.getAsset()}
            weiAmount={lendingAmount}
          />
        </div>
        <div className="tw-w-6/12 tw-px-3">
          <Text className="text-muted">
            {t(translations.lend.currency.borrowArp)}:
          </Text>
          <NextBorrowInterestRate
            asset={lendingPool.getAsset()}
            weiAmount={borrowAmount}
          />
        </div>
      </div>
      {active && (
        <div className="tw-mt-3">
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
