import React from 'react';
import cn from 'classnames';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Input } from 'app/components/Form/Input';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types';
import { Button } from 'app/components/Button';
import { useSendContractTx } from '../../../../hooks/useSendContractTx';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { gasLimit } from 'utils/classifiers';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';

interface Props {
  className?: object;
  address: string;
}
export function ClaimForm({ className, address }: Props) {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const rewardsLocked = checkMaintenance(States.CLAIM_REWARDS);

  const { send, ...tx } = useSendContractTx(
    'lockedSov',
    'createVestingAndStake',
  );

  const { value: lockedBalance } = useCacheCallWithValue(
    'lockedSov',
    'getLockedBalance',
    '',
    address,
  );

  const handleSubmit = () => {
    send(
      [],
      {
        from: address,
        gas: gasLimit[TxType.LOCKED_SOV_CLAIM],
      },
      {
        type: TxType.LOCKED_SOV_CLAIM,
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
        {t(translations.rewardPage.claimForm.title)}
      </div>
      <div className="tw-px-8 tw-mt-6 tw-flex-1 tw-flex tw-flex-col tw-justify-center">
        <div>
          <div className="tw-text-sm tw-mb-1">
            {t(translations.rewardPage.claimForm.availble)}
          </div>
          <Input
            value={weiToNumberFormat(lockedBalance, 4)}
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
                      className="tw-text-warning tw-underline hover:tw-no-underline"
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
                parseFloat(lockedBalance) === 0 ||
                !lockedBalance ||
                rewardsLocked ||
                tx.status === TxStatus.PENDING ||
                tx.status === TxStatus.PENDING_FOR_USER
              }
              onClick={handleSubmit}
              className="tw-w-full tw-mb-4"
              text={t(translations.rewardPage.claimForm.cta)}
            />
          )}

          <div className="tw-text-tiny tw-font-thin">
            {t(translations.rewardPage.claimForm.note) + ' '}
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/sovryn-rewards-explained"
              target="_blank"
              rel="noreferrer noopener"
              className="tw-text-secondary tw-underline"
            >
              {t(translations.rewardPage.claimForm.learn)}
            </a>
          </div>
        </div>
      </div>
      <TxDialog tx={tx} />
    </div>
  );
}
