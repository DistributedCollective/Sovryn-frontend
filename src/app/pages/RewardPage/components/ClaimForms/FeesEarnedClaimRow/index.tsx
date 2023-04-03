import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IClaimFormProps } from '../BaseClaimForm/types';
import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { TxType } from 'store/global/transactions-store/types';
import { translations } from 'locales/i18n';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { currentChainId, gasLimit } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { weiToNumberFormat } from 'utils/display-text/format';
import { ActionButton } from 'app/components/Form/ActionButton';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { Tooltip } from '@blueprintjs/core';
import { bignumber } from 'mathjs';
import classNames from 'classnames';
import { LoadableValue } from 'app/components/LoadableValue';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { simulateTx } from 'utils/simulator/simulateTx';
import { TxTuple } from 'utils/simulator/types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { Sovryn } from 'utils/sovryn';

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

  const { value: maxCheckpoints } = useCacheCallWithValue(
    'feeSharingProxy',
    'numTokenCheckpoints',
    -1,
    contractAddress,
  );
  const { send, ...tx } = useSendContractTx('feeSharingProxy', 'withdraw');
  const { send: withdrawRBTC, ...tx2 } = useSendContractTx(
    'feeSharingProxy',
    'withdrawRBTC',
  );

  const [isSimulating, setIsSimulating] = useState(true);
  const [simulationPassed, setSimulationPassed] = useState(false);

  useEffect(() => {
    if (Number(maxCheckpoints) !== -1) {
      const controller = new AbortController();

      const args =
        asset === Asset.RBTC
          ? [0, address]
          : [contractAddress, maxCheckpoints, address];

      const method = asset === Asset.RBTC ? 'withdrawRBTC' : 'withdraw';

      const tx: TxTuple = [
        {
          to: getContract('feeSharingProxy').address,
          from: address,
          value: '0',
          input: Sovryn.contracts['feeSharingProxy'].methods[method](
            ...args,
          ).encodeABI(),
          gas_price: '0',
          gas: 6_800_000,
        },
      ];

      simulateTx(currentChainId, tx, controller.signal)
        .then(([{ transaction }]) => {
          console.log('simulation response', asset, transaction);
          setSimulationPassed(transaction.status);
        })
        .catch(() => {
          setSimulationPassed(false);
        })
        .finally(() => {
          setIsSimulating(false);
        });

      return () => {
        controller.abort();
      };
    }
  }, [address, asset, contractAddress, maxCheckpoints]);

  const isClaimDisabled = useMemo(
    () =>
      isSimulating ||
      !simulationPassed ||
      claimFeesEarnedLocked ||
      !bignumber(amountToClaim).greaterThan(0) ||
      assetClaimLocked,
    [
      isSimulating,
      simulationPassed,
      claimFeesEarnedLocked,
      amountToClaim,
      assetClaimLocked,
    ],
  );

  const showSimulatorFailureError = useMemo(
    () => !isSimulating && !simulationPassed && Number(amountToClaim) > 0,
    [isSimulating, simulationPassed, amountToClaim],
  );

  const onSubmit = useCallback(() => {
    if (asset === Asset.RBTC) {
      withdrawRBTC(
        [0, address],
        { from: address, gas: gasLimit[TxType.STAKING_REWARDS_CLAIM_RBTC] },
        { type: TxType.STAKING_REWARDS_CLAIM_RBTC },
      );
    } else {
      send(
        [contractAddress, maxCheckpoints, address],
        { from: address, gas: gasLimit[TxType.STAKING_REWARDS_CLAIM] },
        { type: TxType.STAKING_REWARDS_CLAIM },
      );
    }
  }, [address, asset, contractAddress, maxCheckpoints, send, withdrawRBTC]);

  return (
    <>
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
          <TransactionDialog tx={tx} />
          <TransactionDialog tx={tx2} />
        </td>
      </tr>
      {showSimulatorFailureError && (
        <tr>
          <td colSpan={4} className="tw-text-warning">
            {t(translations.rewardPage.claimForm.contractFailure, {
              currency: asset,
            })}
          </td>
        </tr>
      )}
    </>
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
