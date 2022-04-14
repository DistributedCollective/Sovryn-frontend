import React, { useCallback, useMemo } from 'react';
import { bignumber } from 'mathjs';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { useAccount } from 'app/hooks/useAccount';
import { DUST_AMOUNT } from 'utils/classifiers';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types';
import { weiToAssetNumberFormat } from 'utils/display-text/format';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { Tooltip } from '@blueprintjs/core';
import { TxType } from 'store/global/transactions-store/types';

type LockedBalanceProps = {
  hasPendingOrders?: boolean;
};

export const LockedBalance: React.FC<LockedBalanceProps> = ({
  hasPendingOrders,
}) => {
  const { t } = useTranslation();
  const account = useAccount();
  const { loading, value } = useCacheCallWithValue(
    'settlement',
    'balanceOf',
    '0',
    account,
  );

  const { send, ...tx } = useSendContractTx('settlement', 'withdraw');

  const canWithdraw = useMemo(() => {
    return bignumber(value).gt(DUST_AMOUNT) && !hasPendingOrders;
  }, [hasPendingOrders, value]);

  const handleClick = useCallback(
    () => send([value], undefined, { type: TxType.SETTLEMENT_WITDHRAW }),
    [value, send],
  );

  return (
    <div>
      {canWithdraw && !loading && (
        <button
          className="tw-truncate tw-text-xs tw-font-light tw-tracking-normal tw-w-full tw-flex tw-justify-between tw-mt-1 tw-text-primary hover:tw-opacity-75 hover:tw-underline"
          onClick={handleClick}
        >
          <Tooltip
            content={
              <>
                {t(translations.common.unusedBalanceTooltip)}&nbsp;
                <strong>{weiToAssetNumberFormat(value, Asset.RBTC)}</strong>
                &nbsp;
                <AssetRenderer asset={Asset.RBTC} />
              </>
            }
          >
            {t(translations.common.unusedBalance)}
          </Tooltip>
        </button>
      )}
      <TxDialog tx={tx} />
    </div>
  );
};
