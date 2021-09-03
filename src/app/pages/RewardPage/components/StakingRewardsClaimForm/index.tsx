import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Input } from 'app/components/Form/Input';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types';
import { Button, ButtonSize } from 'app/components/Button';
import { useSendContractTx } from '../../../../hooks/useSendContractTx';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite, ethGenesisAddress } from 'utils/classifiers';
import { useBlockSync } from '../../../../hooks/useAccount';
import { contractReader } from '../../../../../utils/sovryn/contract-reader';

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
        'tw-trading-form-card tw-bg-black tw-rounded-3xl tw-p-8 tw-mx-auto xl:tw-mx-0 tw-flex tw-flex-col',
      )}
    >
      <div className="tw-text-center tw-text-xl">
        {t(translations.rewardPage.stakingForm.title)}
      </div>
      <div className="tw-px-8 tw-mt-6 tw-flex-1 tw-flex tw-flex-col tw-justify-center">
        <div>
          <div className="tw-text-sm tw-mb-1">
            {t(translations.rewardPage.stakingForm.available)}
          </div>
          <Input
            value={
              value.loading
                ? t(translations.common.loading)
                : weiToNumberFormat(value.amount, 8)
            }
            readOnly={true}
            appendElem={<AssetRenderer asset={Asset.SOV} />}
          />
        </div>
        <div className={!rewardsLocked ? 'tw-mt-10' : undefined}>
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
              text={t(translations.rewardPage.claimForm.cta)}
              className="tw-w-full tw-mb-4"
              size={ButtonSize.lg}
              disabled={
                parseFloat(value.amount) === 0 ||
                !value.amount ||
                rewardsLocked ||
                tx.status === TxStatus.PENDING ||
                tx.status === TxStatus.PENDING_FOR_USER
              }
              onClick={handleSubmit}
            />
          )}
        </div>
      </div>
      <TxDialog tx={tx} />
    </div>
  );
}
