import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from '../../../../../locales/i18n';
import { ActionButton } from 'form/ActionButton';
import { AddLiquidityDialog } from '../AddLiquidityDialog';
import { RemoveLiquidityDialog } from '../RemoveLiquidityDialog';
import { LiquidityPool } from '../../../../../utils/models/liquidity-pool';
import { PoolAssetInfo } from './PoolAssetInfo';
import { PoolChart } from './PoolChart';
import { UserPoolInfo } from './UserPoolInfo';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { AddLiquidityDialogV1 } from '../AddLiquidityDialog/AddLiquidityDialogV1';
import { RemoveLiquidityDialogV1 } from '../RemoveLiquidityDialog/RemoveLiquidityDialogV1';
import { CardRow } from 'app/components/FinanceV2Components/CardRow';
import { Asset } from 'types';
import { LootDropColors } from 'app/components/FinanceV2Components/LootDrop/styled';

interface Props {
  pool: LiquidityPool;
}

type DialogType = 'none' | 'add' | 'remove';

export function MiningPool({ pool }: Props) {
  const { t } = useTranslation();
  const [dialog, setDialog] = useState<DialogType>('none');
  const canInteract = useCanInteract();
  const [isEmptyBalance, setIsEmptyBalance] = useState(true);

  const onNonEmptyBalance = useCallback(() => setIsEmptyBalance(false), [
    setIsEmptyBalance,
  ]);

  const LeftSection = () => {
    return (
      <div className="tw-flex tw-items-center tw-mr-4">
        {/* Assets and balances */}
        <div className="tw-flex tw-flex-col tw-justify-between">
          {pool.supplyAssets.map((item, index) => (
            <PoolAssetInfo
              key={item.asset}
              pool={pool}
              supplyAsset={item}
              className={index === 1 ? 'tw-mt-2.5' : ''}
            />
          ))}
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
          disabled={!canInteract}
        />
        <ActionButton
          text={t(translations.common.withdraw)}
          onClick={() => setDialog('remove')}
          className="tw-block tw-w-full tw-rounded-lg"
          textClassName="tw-text-base"
          disabled={!canInteract || isEmptyBalance}
        />
      </div>
    );
  };

  return (
    <div>
      <CardRow
        LeftSection={<LeftSection />}
        ChartSection={<PoolChart pool={pool} />}
        Actions={<Actions />}
        DataSection={
          <UserPoolInfo pool={pool} onNonEmptyBalance={onNonEmptyBalance} />
        }
        leftColor={
          (pool.supplyAssets[0].asset === Asset.SOV &&
            pool.supplyAssets[1].asset === Asset.RBTC &&
            LootDropColors.Yellow) ||
          (pool.supplyAssets[0].asset === Asset.ETH &&
            pool.supplyAssets[1].asset === Asset.RBTC &&
            LootDropColors.Green) ||
          undefined
        }
      />
      {canInteract && (
        <>
          {pool.version === 1 && (
            <>
              <AddLiquidityDialogV1
                pool={pool}
                showModal={dialog === 'add'}
                onCloseModal={() => setDialog('none')}
              />
              <RemoveLiquidityDialogV1
                pool={pool}
                showModal={dialog === 'remove'}
                onCloseModal={() => setDialog('none')}
              />
            </>
          )}
          {pool.version === 2 && (
            <>
              <AddLiquidityDialog
                pool={pool}
                showModal={dialog === 'add'}
                onCloseModal={() => setDialog('none')}
              />
              <RemoveLiquidityDialog
                pool={pool}
                showModal={dialog === 'remove'}
                onCloseModal={() => setDialog('none')}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
