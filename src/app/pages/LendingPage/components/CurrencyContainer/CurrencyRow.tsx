import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LendingPool } from 'utils/models/lending-pool';
import { translations } from 'locales/i18n';

import '../../assets/index.scss';
import './style.scss';
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
  const [isEmptyBalance, setIsEmptyBalance] = useState(true);

  const onNonEmptyBalance = useCallback(() => setIsEmptyBalance(false), [
    setIsEmptyBalance,
  ]);

  const LeftSection = () => {
    return (
      <div
        className="tw-flex tw-items-center tw-mr-4"
        style={{ minWidth: 105 }}
      >
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
          text={t(translations.lendingPage.deposit)}
          onClick={() => setDialog('add')}
          className="tw-block tw-w-full tw-mb-3 tw-rounded-lg tw-bg-ctaHover hover:tw-opacity-75"
          textClassName="tw-text-base"
        />
        <ActionButton
          text={t(translations.lendingPage.withdraw)}
          onClick={() => setDialog('remove')}
          className="tw-block tw-w-full tw-rounded-lg"
          textClassName="tw-text-base"
          disabled={isEmptyBalance}
        />
      </div>
    );
  };

  return (
    <div>
      <CardRow
        LeftSection={<LeftSection />}
        ChartSection={
          <div className="mr-3">
            <PoolChart pool={lendingPool} />
          </div>
        }
        Actions={<Actions />}
        DataSection={
          <UserLendingInfo
            lendingPool={lendingPool}
            lendingAmount={lendingAmount}
            onNonEmptyBalance={onNonEmptyBalance}
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
};

export default CurrencyRow;
