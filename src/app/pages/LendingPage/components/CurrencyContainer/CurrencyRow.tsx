import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import styled from 'styled-components/macro';
// import clsx from 'clsx';
// import { Text } from '@blueprintjs/core';

// import { NextSupplyInterestRate } from 'app/components/NextSupplyInterestRate';
// import { NextBorrowInterestRate } from 'app/components/NextBorrowInterestRate';
import { LendingPool } from 'utils/models/lending-pool';
import { translations } from 'locales/i18n';

import '../../assets/index.scss';
import './style.scss';
// import { LoanTokenGraphs } from '../../../../components/LoanTokenGraphs';
import { AssetRenderer } from '../../../../components/AssetRenderer';

import { ActionButton } from 'form/ActionButton';
import { PoolChart } from './PoolChart';
import { CardRow } from 'app/components/FinanceV2Components/CardRow';
import { UserLendingInfo } from './UserLendingInfo';
import { LendingDialog } from '../LendingDialog';

type Props = {
  lendingPool: LendingPool;
  lendingAmount: string;
};

export type DialogType = 'none' | 'add' | 'remove';

const CurrencyRow: React.FC<Props> = ({ lendingPool, lendingAmount }) => {
  const { t } = useTranslation();
  const [dialog, setDialog] = useState<DialogType>('none');

  const LeftSection = () => {
    return (
      <div className="tw-flex tw-items-center tw-mr-4">
        <div className="tw-flex tw-flex-col tw-justify-between">
          <AssetRenderer asset={lendingPool.getAsset()} showImage />
        </div>
      </div>
    );
  };

  const Actions = () => {
    return (
      <div className="tw-ml-5 tw-w-full tw-max-w-8.75-rem">
        <ActionButton
          text={t(translations.common.deposit)}
          onClick={() => setDialog('add')}
          className="tw-block tw-w-full tw-mb-3 tw-rounded-lg tw-bg-ctaHover hover:tw-opacity-75"
          textClassName="tw-text-base"
        />
        <ActionButton
          text={t(translations.common.withdraw)}
          onClick={() => setDialog('remove')}
          className="tw-block tw-w-full tw-rounded-lg"
          textClassName="tw-text-base"
        />
      </div>
    );
  };

  return (
    <div>
      <CardRow
        LeftSection={<LeftSection />}
        ChartSection={<PoolChart pool={lendingPool} />}
        Actions={<Actions />}
        DataSection={
          <UserLendingInfo
            lendingPool={lendingPool}
            lendingAmount={lendingAmount}
          />
        }
        leftColor={undefined}
        chartReady={true}
      />

      <>
        <LendingDialog
          currency={lendingPool.getAsset()}
          showModal={dialog !== 'none'}
          onCloseModal={() => setDialog('none')}
          type={dialog}
          lendingAmount={lendingAmount}
        />
      </>
    </div>
  );
  // return (
  //   <div
  //     className={clsx(
  //       'sovryn-border tw-overflow-hidden tw-pb-0 tw-pt-1 lg:tw-pt-2 currency-container tw-mb-4 tw-text-muted',
  //       active && 'currency-container__active',
  //     )}
  //   >
  //     <div className="tw-flex tw-flex- tw-justify-start tw-items-center currency currency-title lg:tw-w-3/6 tw-mb-4 lg:tw-mb-0 tw-px-4">
  //       <StyledImage src={lendingPool.getAssetDetails().logoSvg} />
  //       <h3 className="tw-m-0 tw-pb-2">
  //         <AssetRenderer asset={lendingPool.getAsset()} />
  //       </h3>
  //     </div>
  //     <div className="tw-flex currency tw-pt-0 tw-pb-4 lg:tw-pt-4">
  //       <div className="tw-w-3/6 tw-px-4">
  //         <Text className="tw-text-muted">
  //           {t(translations.lend.currency.lendArp)}:
  //         </Text>
  //         <NextSupplyInterestRate
  //           asset={lendingPool.getAsset()}
  //           weiAmount={lendingAmount}
  //         />
  //       </div>
  //       <div className="tw-w-3/6 tw-px-4">
  //         <Text className="tw-text-muted">
  //           {t(translations.lend.currency.borrowArp)}:
  //         </Text>
  //         <NextBorrowInterestRate
  //           asset={lendingPool.getAsset()}
  //           weiAmount={borrowAmount}
  //         />
  //       </div>
  //     </div>
  //     {active && (
  //       <div>
  //         <LoanTokenGraphs lendingPool={lendingPool} />
  //       </div>
  //     )}
  //   </div>
  // );
};

export default CurrencyRow;

// const StyledImage = styled.img`
//   width: 44px;
//   height: 44px;
//   object-fit: scale-down;
//   margin-right: 11px;
// `;
