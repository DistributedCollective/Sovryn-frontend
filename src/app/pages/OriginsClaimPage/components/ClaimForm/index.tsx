import React, { useCallback, useMemo } from 'react';
import cn from 'classnames';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Input } from 'app/components/Form/Input';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types';
import { Button } from 'app/components/Button';
import { useSendContractTx } from '../../../../hooks/useSendContractTx';
import { TxType } from 'store/global/transactions-store/types';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';

interface IClaimFormProps {
  address: string;
  className?: string;
}
export function ClaimForm({ className, address }: IClaimFormProps) {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const rewardsLocked = checkMaintenance(States.CLAIM_REWARDS);

  const { send, ...tx } = useSendContractTx(
    'lockedFund',
    'withdrawWaitedUnlockedBalance',
  );

  const { value: getWaitedTS } = useCacheCallWithValue(
    'lockedFund',
    'getWaitedTS',
    '0',
  );

  const { value: balance } = useCacheCallWithValue(
    'lockedFund',
    'getWaitedUnlockedBalance',
    '0',
    address,
  );

  const unlockTime = useMemo(() => Number(getWaitedTS) * 1000, [getWaitedTS]);

  const handleSubmit = useCallback(() => {
    send(
      [address],
      {
        from: address,
      },
      {
        type: TxType.LOCKED_FUND_WAITED_CLAIM,
      },
    );
  }, [address, send]);

  return (
    <div
      className={cn(
        className,
        'tw-trading-form-card tw-bg-black tw-rounded-3xl tw-p-8 tw-mx-auto xl:tw-mx-0 tw-flex tw-flex-col',
      )}
    >
      <div className="text-center tw-text-xl">
        {t(translations.originsClaim.claimForm.title)}
      </div>
      <div className="tw-px-8 tw-mt-6 tw-flex-1 tw-flex tw-flex-col tw-justify-center">
        <div>
          <div className="tw-text-sm tw-mb-1">
            {t(translations.originsClaim.claimForm.availble)}
          </div>
          <Input
            value={weiToNumberFormat(balance, 4)}
            readOnly={true}
            appendElem={<AssetRenderer asset={Asset.FISH} />}
          />
        </div>
        <div className={!rewardsLocked ? 'tw-mt-10' : undefined}>
          {rewardsLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.claimOrigins}
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
                parseFloat(balance) === 0 ||
                !balance ||
                rewardsLocked ||
                new Date().getTime() < unlockTime
              }
              onClick={handleSubmit}
              className="tw-w-full tw-mb-4"
              text={t(translations.originsClaim.claimForm.cta)}
            />
          )}

          <div className="tw-text-tiny tw-font-thin">
            {t(translations.originsClaim.claimForm.note, {
              date: new Date(unlockTime).toLocaleString(),
            })}
          </div>
        </div>
      </div>
      <TxDialog tx={tx} />
    </div>
  );
}
