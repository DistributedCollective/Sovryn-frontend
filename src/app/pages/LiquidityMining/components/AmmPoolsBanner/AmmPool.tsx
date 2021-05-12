import React from 'react';
import { Asset } from '../../../../../types';
import { LiquidityPoolSupplyAsset } from '../../../../../utils/models/liquidity-pool';
import { ActionButton } from 'form/ActionButton';
import { useMining_ApproveAndDeposit } from '../../hooks/useMining_ApproveAndDeposit';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { getPoolTokenContractName } from '../../../../../utils/blockchain/contract-helpers';
import { usePoolToken } from '../../../../hooks/amm/usePoolToken';

interface Props {
  pool: Asset;
  asset: LiquidityPoolSupplyAsset;
  balance: string;
}

export function AmmPool(props: Props) {
  usePoolToken(props.pool, props.asset.asset);
  const { deposit, ...tx } = useMining_ApproveAndDeposit(
    getPoolTokenContractName(props.pool, props.asset.asset),
    props.asset.asset,
    props.asset.getContractAddress(),
    props.balance,
  );
  return (
    <>
      <div className="tw-bg-secondaryBackground tw-m-3 tw-p-3 tw-rounded">
        <div>
          {props.pool}/{props.asset.asset}
        </div>
        <div className="tw-mt-3">
          <ActionButton
            text="Transfer"
            onClick={() => deposit()}
            disabled={tx.loading}
            loading={tx.loading}
          />
        </div>
      </div>
      <TxDialog tx={tx} />
    </>
  );
}
