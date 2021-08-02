import cn from 'classnames';
/**
 *
 * ClaimForm
 *
 */

import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { AssetRenderer } from 'app/components/AssetRenderer';
import { Button } from 'app/components/Button';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { Input } from 'app/components/Form/Input';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { translations } from 'locales/i18n';
import { TxType } from 'store/global/transactions-store/types';
import { Asset } from 'types';
import { gasLimit } from 'utils/classifiers';
import { discordInvite } from 'utils/classifiers';

import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { useSendContractTx } from '../../../../hooks/useSendContractTx';

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
        'tw-trading-form-card tw-p-16 tw-mx-auto xl:tw-mx-0 tw-flex tw-flex-col',
      )}
    >
      <div className="tw-text-xs">
        {t(translations.rewardPage.claimForm.title)}
      </div>
      <div className="tw-mt-1 tw-w-full tw-flex-1 tw-flex tw-flex-col tw-justify-center">
        <div>
          <Input
            value={weiToNumberFormat(lockedBalance, 4)}
            readOnly={true}
            appendElem={<AssetRenderer asset={Asset.SOV} />}
          />
        </div>
        <div className="tw-mt-16">
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
                parseFloat(lockedBalance) === 0 ||
                !lockedBalance ||
                rewardsLocked
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
