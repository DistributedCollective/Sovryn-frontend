import React, { useState } from 'react';
import { ActionButton } from 'form/ActionButton';
import { AddLiquidityDialog } from '../AddLiquidityDialog';
import { RemoveLiquidityDialog } from '../RemoveLiquidityDialog';
import { LiquidityPool } from '../../../../../utils/models/liquidity-pool';
import { PoolAssetInfo } from './PoolAssetInfo';
import { PoolChart } from './PoolChart';
import { UserPoolInfo } from './UserPoolInfo';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { AddLiquidityDialogV1 } from '../AddLiquidityDialog/AddLiquidityDialogV1';

interface Props {
  pool: LiquidityPool;
}

type DialogType = 'none' | 'add' | 'remove';

export function MiningPool({ pool }: Props) {
  const [dialog, setDialog] = useState<DialogType>('none');
  const canInteract = useCanInteract();
  return (
    <>
      <div className="d-flex tw-flex-row tw-justify-between tw-items-center tw-mb-3 tw-bg-secondaryBackground tw-rounded-lg tw-p-3">
        {/* Pie Chart */}
        <div className="tw-w-12 tw-h-12 tw-rounded-full tw-bg-white tw-mr-5" />
        {/* Assets and balances */}
        <div className="tw-flex tw-flex-col tw-space-y-2">
          {pool.supplyAssets.map(item => (
            <PoolAssetInfo key={item.asset} pool={pool} supplyAsset={item} />
          ))}
        </div>
        {/* Graph chart */}
        <PoolChart pool={pool} />
        {/* Some info */}
        <UserPoolInfo pool={pool} />
        {/* Actions */}
        <div>
          <ActionButton
            text="Deposit"
            onClick={() => setDialog('add')}
            className="tw-block tw-w-full tw-mb-3"
            disabled={!canInteract}
          />
          <ActionButton
            text="Withdraw"
            onClick={() => setDialog('remove')}
            className="tw-block tw-w-full"
            disabled={!canInteract}
          />
        </div>
      </div>
      {canInteract && (
        <>
          {pool.version === 1 && (
            <>
              <AddLiquidityDialogV1
                pool={pool}
                showModal={dialog === 'add'}
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
    </>
  );
}
