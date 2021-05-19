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
import { RemoveLiquidityDialogV1 } from '../RemoveLiquidityDialog/RemoveLiquidityDialogV1';
import { PieChart } from '../../../../components/FinanceV2Components/PieChart';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import {
  getAmmContractName,
  getTokenContract,
} from '../../../../../utils/blockchain/contract-helpers';
import { CardRow } from 'app/components/FinanceV2Components/CardRow';

interface Props {
  pool: LiquidityPool;
}

type DialogType = 'none' | 'add' | 'remove';

export function MiningPool({ pool }: Props) {
  const [dialog, setDialog] = useState<DialogType>('none');
  const canInteract = useCanInteract();

  const firstAssetWeight = useCacheCallWithValue(
    getAmmContractName(pool.poolAsset),
    'reserveWeight',
    '0',
    getTokenContract(pool.supplyAssets[0].asset).address,
  );

  const secondAssetWeight = useCacheCallWithValue(
    getAmmContractName(pool.poolAsset),
    'reserveWeight',
    '0',
    getTokenContract(pool.supplyAssets[1].asset).address,
  );

  const LeftSection = () => {
    return (
      <div className="tw-flex tw-items-center tw-mr-4">
        <PieChart
          firstAsset={pool.supplyAssets[0].asset}
          secondAsset={pool.supplyAssets[1].asset}
          firstPercentage={Number(firstAssetWeight.value) / 1e4}
          secondPercentage={Number(secondAssetWeight.value) / 1e4}
          className="tw-mr-4"
        />
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
          text="Deposit"
          onClick={() => setDialog('add')}
          className="tw-block tw-w-full tw-mb-3 tw-rounded-lg hover:tw-bg-ctaHover"
          textClassName="tw-text-base tw-font-semibold"
          disabled={!canInteract}
        />
        <ActionButton
          text="Withdraw"
          onClick={() => setDialog('remove')}
          className="tw-block tw-w-full tw-rounded-lg hover:tw-bg-ctaHover"
          textClassName="tw-text-base tw-font-semibold"
          disabled={!canInteract}
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
        DataSection={<UserPoolInfo pool={pool} />}
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
