import React from 'react';
import { Asset } from '../../../../../types';
import { ActionButton } from 'app/components/Form/ActionButton';
import { useMining_ApproveAndDeposit } from '../../hooks/useMining_ApproveAndDeposit';

import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { TransactionDialog } from 'app/components/TransactionDialog';

interface IAmmPoolProps {
  pool: AmmLiquidityPool;
  asset: Asset;
  balance: string;
}

export const AmmPool: React.FC<IAmmPoolProps> = props => {
  const { t } = useTranslation();
  const { deposit, ...tx } = useMining_ApproveAndDeposit(
    props.pool,
    props.asset,
    props.balance,
  );
  return (
    <>
      <div className="tw-flex tw-items-center tw-m-2">
        <div className="tw-w-1/2 tw-text-right">
          <AssetRenderer asset={props.pool.assetA} /> /
          <AssetRenderer asset={props.pool.assetB} /> (
          <AssetRenderer asset={props.asset} />)
        </div>
        <div className="tw-ml-7">
          <ActionButton
            className="tw-rounded-lg"
            text={t(translations.liquidity.transfer)}
            onClick={() => deposit()}
            disabled={tx.loading}
            loading={tx.loading}
          />
        </div>
      </div>
      <TransactionDialog tx={tx} />
    </>
  );
};
