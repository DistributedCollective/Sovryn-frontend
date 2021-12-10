import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from '../../../../../locales/i18n';
import { ActionButton } from 'app/components/Form/ActionButton';
import { Spinner } from 'app/components/Spinner';
import { AddLiquidityDialog } from '../AddLiquidityDialog';
import { RemoveLiquidityDialog } from '../RemoveLiquidityDialog';
import { PoolAssetInfo } from './PoolAssetInfo';
import { PoolChart } from './PoolChart';
import { UserPoolInfo } from './UserPoolInfo';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { AddLiquidityDialogV1 } from '../AddLiquidityDialog/AddLiquidityDialogV1';
import { RemoveLiquidityDialogV1 } from '../RemoveLiquidityDialog/RemoveLiquidityDialogV1';
import { CardRow } from 'app/components/FinanceV2Components/CardRow';
import { useMaintenance } from 'app/hooks/useMaintenance';
import type { AmmHistory } from './types';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';

interface IMiningPoolProps {
  pool: AmmLiquidityPool;
  ammData: AmmHistory;
  linkAsset?: string;
}

type DialogType = 'none' | 'add' | 'remove';

export const MiningPool: React.FC<IMiningPoolProps> = ({
  pool,
  ammData,
  linkAsset,
}) => {
  const { t } = useTranslation();
  const [dialog, setDialog] = useState<DialogType>(
    linkAsset && pool.key === LiquidityPoolDictionary.getByKey(linkAsset)?.key
      ? 'add'
      : 'none',
  );
  const canInteract = useCanInteract();
  const [isEmptyBalance, setIsEmptyBalance] = useState(true);
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.ADD_LIQUIDITY]: addliquidityLocked,
    [States.REMOVE_LIQUIDITY]: removeliquidityLocked,
  } = checkMaintenances();

  const onNonEmptyBalance = useCallback(() => setIsEmptyBalance(false), [
    setIsEmptyBalance,
  ]);

  const [successfulTransactions, setSuccessfulTransactions] = useState(0);

  const onSuccessfulTransaction = useCallback(
    () => setSuccessfulTransactions(prevValue => prevValue + 1),
    [setSuccessfulTransactions],
  );

  const Actions = () => {
    return (
      <div className="tw-ml-5 tw-w-full tw-max-w-36">
        <ActionButton
          text={t(translations.liquidityMining.deposit)}
          onClick={() => setDialog('add')}
          className="tw-block tw-w-full tw-mb-3 tw-rounded-lg tw-bg-primary-25 hover:tw-opacity-75"
          textClassName="tw-text-base"
          disabled={!canInteract || addliquidityLocked}
        />
        <ActionButton
          text={t(translations.liquidityMining.withdraw)}
          onClick={() => setDialog('remove')}
          className="tw-block tw-w-full tw-rounded-lg"
          textClassName="tw-text-base"
          disabled={!canInteract || isEmptyBalance || removeliquidityLocked}
        />
      </div>
    );
  };

  return (
    <div>
      <CardRow
        LeftSection={
          pool && (
            <div className="tw-flex tw-items-center tw-mr-4">
              {/* Assets and balances */}
              <div className="tw-flex tw-flex-col tw-justify-between">
                <PoolAssetInfo pool={pool} supplyAsset={pool.assetA} />
                <PoolAssetInfo
                  pool={pool}
                  supplyAsset={pool.assetB}
                  className="tw-mt-2.5"
                />
              </div>
            </div>
          )
        }
        ChartSection={
          ammData ? <PoolChart pool={pool} history={ammData} /> : <Spinner />
        }
        Actions={<Actions />}
        DataSection={
          <UserPoolInfo
            pool={pool}
            onNonEmptyBalance={onNonEmptyBalance}
            successfulTransactions={successfulTransactions}
          />
        }
        leftColor={pool.lootDropColor}
      />
      {canInteract && (
        <>
          {pool.converterVersion === 1 && (
            <>
              <AddLiquidityDialogV1
                pool={pool}
                showModal={dialog === 'add'}
                onCloseModal={() => setDialog('none')}
                onSuccess={onSuccessfulTransaction}
              />
              <RemoveLiquidityDialogV1
                pool={pool}
                showModal={dialog === 'remove'}
                onCloseModal={() => setDialog('none')}
                onSuccess={onSuccessfulTransaction}
              />
            </>
          )}
          {pool.converterVersion === 2 && (
            <>
              <AddLiquidityDialog
                pool={pool}
                showModal={dialog === 'add'}
                onCloseModal={() => setDialog('none')}
                onSuccess={onSuccessfulTransaction}
              />
              <RemoveLiquidityDialog
                pool={pool}
                showModal={dialog === 'remove'}
                onCloseModal={() => setDialog('none')}
                onSuccess={onSuccessfulTransaction}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
