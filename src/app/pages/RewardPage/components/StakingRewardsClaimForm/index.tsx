import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Input } from 'app/components/Form/Input';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types';
import { Button } from 'app/components/Button';
import { useSendContractTx } from '../../../../hooks/useSendContractTx';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite, ethGenesisAddress } from 'utils/classifiers';
import { useBlockSync } from '../../../../hooks/useAccount';
import { contractReader } from '../../../../../utils/sovryn/contract-reader';
import { Tooltip } from '@blueprintjs/core';
import { weiTo18 } from 'utils/blockchain/math-helpers';

interface Props {
  className?: string;
  address: string;
}
export function StakingRewardsClaimForm({ className, address }: Props) {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const rewardsLocked = checkMaintenance(States.CLAIM_REWARDS);
  const syncBlock = useBlockSync();

  const { send, ...tx } = useSendContractTx('stakingRewards', 'collectReward');
  const [value, setValue] = useState({ amount: '0', loading: true });

  useEffect(() => {
    if (address && address !== ethGenesisAddress) {
      setValue({ amount: '0', loading: true });
      contractReader
        .call<{ amount: string }>(
          'stakingRewards',
          'getStakerCurrentReward',
          [true],
          address,
        )
        .then(result => {
          setValue({ amount: result.amount, loading: false });
        })
        .catch(error => {
          setValue({ amount: '0', loading: false });
        });
    } else {
      setValue({ amount: '0', loading: false });
    }
  }, [address, syncBlock]);

  const handleSubmit = () => {
    send(
      [],
      {
        from: address,
      },
      {
        type: TxType.STAKING_REWARDS_CLAIM,
      },
    );
  };
  return (
    <div
      className={cn(
        className,
        'tw-trading-form-card tw-p-16 tw-mx-auto xl:tw-mx-0 tw-flex tw-flex-col',
      )}
    >
      <div className="tw-text-sm">
        {t(translations.rewardPage.stakingForm.title)}
      </div>
      <div className="tw-mt-1 tw-w-full tw-flex-1 tw-flex tw-flex-col tw-justify-center">
        <Tooltip content={`${weiTo18(value.amount)} SOV`}>
          <Input
            value={
              value.loading
                ? t(translations.common.loading)
                : `${weiToNumberFormat(value.amount, 6)}...`
            }
            readOnly={true}
            appendElem={<AssetRenderer asset={Asset.SOV} />}
            inputClassName="tw-text-center tw-text-2xl tw-font-normal"
          />
        </Tooltip>
        <div className={!rewardsLocked ? 'tw-mt-16' : undefined}>
          {rewardsLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.claimRewards}
                  components={[
                    <a
                      href={discordInvite}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="tw-text-Red tw-underline hover:tw-no-underline"
                    >
                      x
                    </a>,
                  ]}
                />
              }
            />
          )}
          {!rewardsLocked && (
            <Button
              disabled={
                parseFloat(value.amount) === 0 ||
                !value.amount ||
                rewardsLocked ||
                tx.status === TxStatus.PENDING ||
                tx.status === TxStatus.PENDING_FOR_USER
              }
              onClick={handleSubmit}
              className="tw-w-full tw-mb-4"
              text={t(translations.rewardPage.claimForm.cta)}
            />
          )}
        </div>
      </div>
      <TxDialog tx={tx} />
    </div>
  );
}
