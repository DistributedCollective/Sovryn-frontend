import React, { FormEvent, useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { discordInvite } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { weiTo4 } from 'utils/blockchain/math-helpers';
import { useStaking_computeWeightByDate } from '../../../hooks/staking/useStaking_computeWeightByDate';
import { useStaking_WEIGHT_FACTOR } from '../../../hooks/staking/useStaking_WEIGHT_FACTOR';
import { useStaking_timestampToLockDate } from 'app/hooks/staking/useStaking_timestampToLockDate';

interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  address: string;
  timestamp: number;
  onChangeAddress: (value: string) => void;
  isValid: boolean;
  weiAmount: string;
  onCloseModal: () => void;
}

export function DelegateForm(props: Props) {
  const now = new Date();
  const [weight, setWeight] = useState('');
  const [votingPower, setVotingPower] = useState(0);
  const WEIGHT_FACTOR = useStaking_WEIGHT_FACTOR();

  const currentLockDate = useStaking_timestampToLockDate(
    Math.round(now.getTime() / 1e3),
  );

  const getWeight = useStaking_computeWeightByDate(
    props.timestamp,
    Number(currentLockDate.value),
  );
  const { t } = useTranslation();
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.DELEGATE_STAKES]: delegateStakesLocked,
    [States.DELEGATE_VESTS]: delegateVestsLocked,
  } = checkMaintenances();

  useEffect(() => {
    setWeight(getWeight.value);
    if (Number(WEIGHT_FACTOR.value) && Number(weight)) {
      setVotingPower(
        (Number(props.weiAmount) * Number(weight)) /
          Number(WEIGHT_FACTOR.value),
      );
    }
  }, [getWeight.value, weight, props.weiAmount, WEIGHT_FACTOR.value]);

  return (
    <>
      <h3 className="tw-text-center tw-mb-10 tw-leading-10 tw-text-3xl">
        {t(translations.stake.actions.delegate)}
      </h3>
      <form onSubmit={props.handleSubmit}>
        <div className="tw-mb-9 md:tw-px-9 tw-tracking-normal">
          <label
            className="tw-leading-4 tw-block tw-text-sov-white tw-text-md tw-font-medium tw-mb-2"
            htmlFor="address"
          >
            {t(translations.stake.delegation.delegateTo)}:
          </label>
          <div className="tw-flex tw-space-x-4 tw-relative tw-mb-3">
            <input
              className="tw-appearance-none tw-border tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-2 tw-bg-sov-white tw-text-black tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
              id="address"
              type="text"
              value={props.address}
              placeholder={t(translations.stake.delegation.address)}
              onChange={e => props.onChangeAddress(e.currentTarget.value)}
              data-action-id="staking-stake-delegate-addressInput"
            />
          </div>
          <div className="my-2">
            {t(translations.stake.currentStakes.votingPower)}:{' '}
            {weiTo4(votingPower)}
          </div>
          {props.address && (
            <TxFeeCalculator
              args={[props.address.toLowerCase(), Number(props.timestamp)]}
              methodName="delegate"
              contractName="staking"
            />
          )}
        </div>
        {(delegateStakesLocked || delegateVestsLocked) && (
          <ErrorBadge
            content={
              <Trans
                i18nKey={translations.maintenance.delegateModal}
                components={[
                  <a
                    href={discordInvite}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                  >
                    x
                  </a>,
                ]}
              />
            }
          />
        )}
        <div className="tw-grid tw-grid-rows-1 tw-grid-flow-col tw-gap-4">
          <button
            type="submit"
            className={`tw-uppercase tw-w-full tw-text-black tw-bg-primary tw-text-xl tw-font-extrabold tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out ${
              (!props.isValid || delegateStakesLocked || delegateVestsLocked) &&
              'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-opacity-100'
            }`}
            disabled={
              !props.isValid || delegateStakesLocked || delegateVestsLocked
            }
            data-action-id="staking-stake-delegate-confirmButton"
          >
            {t(translations.stake.actions.confirm)}
          </button>
          <button
            type="button"
            onClick={() => {
              props.onCloseModal();
              props.onChangeAddress('');
            }}
            className="tw-border tw-border-primary tw-rounded-lg tw-text-primary tw-uppercase tw-w-full tw-text-xl tw-font-extrabold tw-px-4 tw-py-2 hover:tw-bg-primary hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out"
            data-action-id="staking-stake-delegate-cancelButton"
          >
            {t(translations.stake.actions.cancel)}
          </button>
        </div>
      </form>
    </>
  );
}
