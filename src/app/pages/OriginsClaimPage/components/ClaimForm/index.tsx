import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Input } from 'app/components/Form/Input';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types';
import { Button, ButtonSize } from 'app/components/Button';
import { useSendContractTx } from '../../../../hooks/useSendContractTx';
import { TxType } from 'store/global/transactions-store/types';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite, gasLimit } from 'utils/classifiers';
import { bignumber } from 'mathjs';
import { TransactionDialog } from 'app/components/TransactionDialog';

interface IClaimFormProps {
  address: string;
  className?: string;
}
export const ClaimForm: React.FC<IClaimFormProps> = ({
  className,
  address,
}) => {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const rewardsLocked = checkMaintenance(States.CLAIM_REWARDS);

  const { value: getWaitedTS } = useCacheCallWithValue(
    'lockedFund',
    'getWaitedTS',
    '0',
  );

  const { value: getWaitedUnlockedBalance } = useCacheCallWithValue(
    'lockedFund',
    'getWaitedUnlockedBalance',
    '0',
    address,
  );

  const { value: getVestedBalance } = useCacheCallWithValue(
    'lockedFund',
    'getVestedBalance',
    '0',
    address,
  );

  const balance = useMemo(
    () => bignumber(getVestedBalance).add(getWaitedUnlockedBalance).toFixed(0),
    [getVestedBalance, getWaitedUnlockedBalance],
  );

  const unlockTime = useMemo(() => Number(getWaitedTS) * 1000, [getWaitedTS]);

  const [fn, args] = useMemo(() => {
    let fn = 'withdrawWaitedUnlockedBalance';
    let args: string[] = [address];
    if (
      parseFloat(getVestedBalance) > 0 &&
      parseFloat(getWaitedUnlockedBalance) > 0
    ) {
      fn = 'withdrawAndStakeTokens';
      args = [address];
    } else if (parseFloat(getWaitedUnlockedBalance) > 0) {
      fn = 'withdrawWaitedUnlockedBalance';
      args = [address];
    } else if (parseFloat(getVestedBalance) > 0) {
      fn = 'createVestingAndStake';
      args = [];
    }
    return [fn, args];
  }, [getVestedBalance, getWaitedUnlockedBalance, address]);

  const { send, ...tx } = useSendContractTx('lockedFund', fn);

  const handleSubmit = useCallback(() => {
    send(
      args,
      {
        from: address,
        gas: gasLimit[TxType.LOCKED_FUND_WAITED_CLAIM],
      },
      {
        type: TxType.LOCKED_FUND_WAITED_CLAIM,
      },
    );
  }, [args, address, send]);

  return (
    <div
      className={classNames(
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
              text={t(translations.originsClaim.claimForm.cta)}
              className="tw-w-full tw-mb-4"
              size={ButtonSize.lg}
              disabled={
                parseFloat(balance) === 0 ||
                !balance ||
                rewardsLocked ||
                new Date().getTime() < unlockTime
              }
              onClick={handleSubmit}
            />
          )}

          <div className="tw-text-tiny tw-font-extralight">
            {t(translations.originsClaim.claimForm.note, {
              date: new Date(unlockTime).toLocaleString(),
            })}
            {parseFloat(getWaitedUnlockedBalance) > 0 && (
              <div className="tw-mt-1">
                {t(translations.originsClaim.claimForm.unlockedNote, {
                  amount: weiToNumberFormat(getWaitedUnlockedBalance, 4),
                })}
              </div>
            )}
            {parseFloat(getVestedBalance) > 0 && (
              <div className="tw-mt-1">
                {t(translations.originsClaim.vestForm.note, {
                  amount: weiToNumberFormat(getVestedBalance, 4),
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <TransactionDialog tx={tx} />
    </div>
  );
};
