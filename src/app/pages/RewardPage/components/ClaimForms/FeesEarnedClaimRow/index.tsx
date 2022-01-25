import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IClaimFormProps } from '../BaseClaimForm/types';
import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { TxType } from 'store/global/transactions-store/types';
import { translations } from 'locales/i18n';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { gasLimit } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { weiToNumberFormat } from 'utils/display-text/format';
import { ActionButton } from 'app/components/Form/ActionButton';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { Tooltip } from '@blueprintjs/core';
import { bignumber } from 'mathjs';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import classNames from 'classnames';

interface IFeesEarnedClaimRow extends IClaimFormProps {
  rbtcValue: string;
  contract: string;
  asset: Asset;
}

export const FeesEarnedClaimRow: React.FC<IFeesEarnedClaimRow> = ({
  amountToClaim,
  contract,
  asset,
  rbtcValue,
}) => {
  const { t } = useTranslation();
  const address = useAccount();
  const { checkMaintenance, States } = useMaintenance();
  const claimFeesEarnedLocked = checkMaintenance(States.CLAIM_FEES_EARNED);

  const { value: maxCheckpoints } = useCacheCallWithValue(
    'feeSharingProxy',
    'numTokenCheckpoints',
    100,
    contract,
  );
  const { send, ...tx } = useSendContractTx('feeSharingProxy', 'withdraw');

  const isClaimDisabled = useMemo(
    () => claimFeesEarnedLocked || !bignumber(amountToClaim).greaterThan(0),
    [claimFeesEarnedLocked, amountToClaim],
  );

  const onSubmit = useCallback(() => {
    send(
      [contract, maxCheckpoints, address],
      { from: address, gas: gasLimit[TxType.STAKING_REWARDS_CLAIM] },
      { type: TxType.STAKING_REWARDS_CLAIM },
    );
  }, [address, contract, maxCheckpoints, send]);

  return (
    <tr
      className={classNames({
        'tw-opacity-50': isClaimDisabled,
      })}
    >
      <td>
        <AssetRenderer asset={asset} />
      </td>
      <td>
        <FeeValue value={amountToClaim} asset={asset} />
      </td>
      <td>
        {'≈ '}
        <FeeValue value={rbtcValue} asset={Asset.RBTC} />
      </td>
      <td>
        <ActionButton
          text={t(translations.rewardPage.claimForm.cta)}
          onClick={onSubmit}
          className={classNames(
            'tw-border-none tw-px-4 xl:tw-px-2 2xl:tw-px-4',
            {
              'tw-cursor-not-allowed': isClaimDisabled,
            },
          )}
          textClassName="tw-text-xs tw-overflow-visible tw-font-bold"
          disabled={isClaimDisabled}
          title={
            (claimFeesEarnedLocked &&
              t(translations.maintenance.claimRewards).replace(
                /<\/?\d+>/g,
                '',
              )) ||
            undefined
          }
        />
        <TxDialog tx={tx} />
      </td>
    </tr>
  );
};
interface IFeesValue {
  value: string;
  asset: Asset;
}
export const FeeValue: React.FC<IFeesValue> = ({ value, asset }) => (
  <>
    {bignumber(value).greaterThan(0) ? (
      <Tooltip content={`${weiTo18(value)} ${asset}`}>
        {weiToNumberFormat(value, 6)}
      </Tooltip>
    ) : (
      <>0</>
    )}
  </>
);
