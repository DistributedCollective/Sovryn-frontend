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
import classNames from 'classnames';
import { LoadableValue } from 'app/components/LoadableValue';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { useGetNextPositiveCheckpoint } from 'app/pages/RewardPage/hooks/useGetNextPositiveCheckpoint';
import { getMaxProcessableCheckpoints } from 'utils/helpers';

interface IFeesEarnedClaimRowProps extends IClaimFormProps {
  rbtcValue: number;
  contractAddress: string;
  asset: Asset;
  loading?: boolean;
  assetClaimLocked?: boolean;
}

export const FeesEarnedClaimRow: React.FC<IFeesEarnedClaimRowProps> = ({
  amountToClaim,
  contractAddress,
  asset,
  rbtcValue,
  loading,
  assetClaimLocked = false,
}) => {
  const { t } = useTranslation();
  const address = useAccount();
  const { checkMaintenance, States } = useMaintenance();
  const claimFeesEarnedLocked = checkMaintenance(States.CLAIM_FEES_EARNED);

  const isRBTC = useMemo(() => asset === Asset.RBTC || asset === Asset.WRBTC, [
    asset,
  ]);

  const { value: maxCheckpoints } = useCacheCallWithValue(
    'feeSharingProxy',
    'totalTokenCheckpoints',
    -1,
    contractAddress,
  );

  const {
    userCheckpoint,
    updateNextPositiveCheckpoint,
  } = useGetNextPositiveCheckpoint(contractAddress, Number(maxCheckpoints));

  const { send: withdraw, ...withdrawTx } = useSendContractTx(
    'feeSharingProxy',
    'withdraw',
  );
  const { send: withdrawRBTC, ...withdrawRBTCTx } = useSendContractTx(
    'feeSharingProxy',
    'withdrawRbtcTokens',
  );
  const {
    send: withdrawStartingFromCheckpoint,
    ...withdrawStartingFromCheckpointTx
  } = useSendContractTx('feeSharingProxy', 'withdrawStartingFromCheckpoint');
  const {
    send: withdrawRBTCStartingFromCheckpoint,
    ...withdrawRBTCStartingFromCheckpointTx
  } = useSendContractTx(
    'feeSharingProxy',
    'withdrawRBTCStartingFromCheckpoint',
  );

  const isClaimDisabled = useMemo(
    () =>
      !userCheckpoint?.hasFees ||
      claimFeesEarnedLocked ||
      !bignumber(amountToClaim).greaterThan(0) ||
      assetClaimLocked,
    [userCheckpoint, claimFeesEarnedLocked, amountToClaim, assetClaimLocked],
  );

  const maxWithdrawCheckpoint = useMemo(
    () =>
      Number(maxCheckpoints) > getMaxProcessableCheckpoints(asset)
        ? String(getMaxProcessableCheckpoints(asset))
        : maxCheckpoints,
    [maxCheckpoints, asset],
  );
  const onSubmit = useCallback(() => {
    if (userCheckpoint?.hasSkippedCheckpoints) {
      if (isRBTC) {
        withdrawRBTCStartingFromCheckpoint(
          [
            [contractAddress],
            [userCheckpoint?.checkpointNum],
            maxWithdrawCheckpoint,
            address,
          ],
          { from: address, gas: gasLimit[TxType.STAKING_REWARDS_CLAIM_RBTC] },
          { type: TxType.STAKING_REWARDS_CLAIM_RBTC },
        );
      } else {
        withdrawStartingFromCheckpoint(
          [
            [contractAddress],
            [userCheckpoint?.checkpointNum],
            maxWithdrawCheckpoint,
            address,
          ],
          { from: address, gas: gasLimit[TxType.STAKING_REWARDS_CLAIM] },
          { type: TxType.STAKING_REWARDS_CLAIM },
        );
      }
    } else {
      if (isRBTC) {
        withdrawRBTC(
          [[contractAddress], maxWithdrawCheckpoint, address],
          { from: address, gas: gasLimit[TxType.STAKING_REWARDS_CLAIM_RBTC] },
          { type: TxType.STAKING_REWARDS_CLAIM_RBTC },
        );
      } else {
        withdraw(
          [contractAddress, maxWithdrawCheckpoint, address],
          { from: address, gas: gasLimit[TxType.STAKING_REWARDS_CLAIM] },
          { type: TxType.STAKING_REWARDS_CLAIM },
        );
      }
    }
  }, [
    userCheckpoint?.hasSkippedCheckpoints,
    userCheckpoint?.checkpointNum,
    isRBTC,
    withdrawRBTCStartingFromCheckpoint,
    maxWithdrawCheckpoint,
    address,
    withdrawStartingFromCheckpoint,
    contractAddress,
    withdrawRBTC,
    withdraw,
  ]);

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
        <LoadableValue
          value={<FeeValue value={rbtcValue} asset={Asset.RBTC} />}
          loading={loading}
        />
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
            ((claimFeesEarnedLocked || assetClaimLocked) &&
              t(translations.maintenance.claimRewards).replace(
                /<\/?\d+>/g,
                '',
              )) ||
            undefined
          }
          dataActionId={`rewards-claim-feesearned-${asset}`}
        />
        <TransactionDialog tx={withdrawTx} />
        <TransactionDialog tx={withdrawRBTCTx} />
        <TransactionDialog
          tx={withdrawStartingFromCheckpointTx}
          onSuccess={updateNextPositiveCheckpoint}
        />
        <TransactionDialog
          tx={withdrawRBTCStartingFromCheckpointTx}
          onSuccess={updateNextPositiveCheckpoint}
        />
      </td>
    </tr>
  );
};
interface IFeeValueProps {
  value: string | number;
  asset: Asset;
}
const FeeValue: React.FC<IFeeValueProps> = ({ value, asset }) => (
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
