import React from 'react';
import { Asset } from '../../../../../types';
import { LiquidityPoolSupplyAsset } from '../../../../../utils/models/liquidity-pool';
import { ActionButton } from 'app/components/Form/ActionButton';
import { useMining_ApproveAndDeposit } from '../../hooks/useMining_ApproveAndDeposit';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { getPoolTokenContractName } from '../../../../../utils/blockchain/contract-helpers';
import { usePoolToken } from '../../../../hooks/amm/usePoolToken';

import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';

interface Props {
  pool: Asset;
  asset: LiquidityPoolSupplyAsset;
  balance: string;
}

export function AmmPool(props: Props) {
  const { t } = useTranslation();
  usePoolToken(props.pool, props.asset.asset);
  const { deposit, ...tx } = useMining_ApproveAndDeposit(
    getPoolTokenContractName(props.pool, props.asset.asset),
    props.asset.asset,
    props.asset.getContractAddress(),
    props.balance,
  );
  return (
    <>
      <div className="tw-flex tw-items-center tw-m-2">
        <div className="tw-w-1/2 tw-text-right">
          {props.pool}/{props.asset.asset}
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
      <TxDialog tx={tx} />
    </>
  );
}
