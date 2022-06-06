import React, { FormEvent } from 'react';
import dayjs from 'dayjs';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { CacheCallResponse } from 'app/hooks/useCacheCall';
import { StakingDateSelector } from '../../../components/StakingDateSelector';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { discordInvite } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';

interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  timestamp?: number;
  onChangeTimestamp: (value: number) => void;
  sovBalance: string;
  isSovBalanceLoading: boolean;
  isValid: boolean;
  kickoff: CacheCallResponse;
  balanceOf: CacheCallResponse;
  stakes: string[];
  votePower?: number;
  prevExtend: number;
  onCloseModal: () => void;
}

export function ExtendStakeForm(props: Props) {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const stakingLocked = checkMaintenance(States.STAKING);
  return (
    <>
      <h3 className="tw-text-center tw-mb-10 tw-leading-10 tw-text-3xl">
        {t(translations.stake.extending.title)}
      </h3>
      <div className="tw-mb-4 md:tw-px-9 tw-tracking-normal tw-text-xs">
        {t(translations.stake.extending.previousUntil)}:
        <br />
        <span className="tw-font-bold">
          {dayjs(props.prevExtend * 1e3).format('L')}
        </span>
      </div>
      <form onSubmit={props.handleSubmit}>
        <div className="tw-mb-9 md:tw-px-9 tw-tracking-normal">
          <label
            className="tw-leading-4 tw-block tw-text-sov-white tw-text-md tw-font-medium tw-mb-2"
            htmlFor="amount"
          >
            {t(translations.stake.extending.amountToStake)}:
          </label>
          <div className="tw-flex tw-space-x-4 tw-relative">
            <input
              readOnly
              className="tw-appearance-none tw-border tw-border-solid tw-border-sov-white tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-pr-12 tw-pl-8 tw-bg-black tw-text-sov-white tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
              id="amount"
              type="text"
              defaultValue={props.amount}
            />
            <span className="tw-text-sov-white tw-text-md tw-font-semibold tw-absolute tw-top-3 tw-right-3 tw-leading-4">
              {t(translations.stake.sov)}
            </span>
          </div>

          <StakingDateSelector
            title="Select new date"
            kickoffTs={Number(props.kickoff.value)}
            value={props.timestamp}
            onClick={value => props.onChangeTimestamp(value)}
            stakes={props.stakes}
            prevExtend={props.prevExtend}
            delegate={false}
          />

          <label
            className="tw-block tw-text-sov-white tw-text-md tw-font-medium tw-mb-2 tw-mt-8"
            htmlFor="voting-power"
          >
            {t(translations.stake.extending.votingPowerReceived)}:
          </label>
          <div className="tw-flex tw-space-x-4 tw-mb-3">
            <input
              readOnly
              className="tw-border tw-border-gray-3 tw-border-opacity-100 tw-border-solid tw-appearance-none tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-3 tw-bg-transparent tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
              id="voting-power"
              type="text"
              placeholder="0"
              value={numberFromWei(props.votePower)}
            />
          </div>
          <TxFeeCalculator
            args={[Number(props.prevExtend), Number(props.timestamp)]}
            methodName="extendStakingDuration"
            contractName="staking"
          />
          <div className="tw-text-gray-1 tw-text-xs tw-mt-3 tw-hidden">
            {t(translations.stake.extending.balance)}:{' '}
            <span
              className={`tw-text-gray-6 ${
                props.isSovBalanceLoading && 'tw-skeleton'
              }`}
            >
              {numberFromWei(props.sovBalance).toLocaleString()}
            </span>{' '}
            {t(translations.stake.sov)}
            {Number(props.votePower) > 0 && (
              <>
                <br />
                {t(translations.stake.extending.willAddedVote)}: +{' '}
                {numberFromWei(props.votePower).toLocaleString()}
              </>
            )}
          </div>
        </div>
        {stakingLocked && (
          <ErrorBadge
            content={
              <Trans
                i18nKey={translations.maintenance.stakingModal}
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
              (!props.isValid || stakingLocked) &&
              'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-opacity-100'
            }`}
            disabled={!props.isValid || stakingLocked}
            data-action-id="staking-stake-extend-confirmButton"
          >
            {t(translations.stake.actions.confirm)}
          </button>
          <button
            type="button"
            onClick={() => props.onCloseModal()}
            className="tw-border tw-border-primary tw-rounded-lg tw-text-primary tw-uppercase tw-w-full tw-text-xl tw-font-extrabold tw-px-4 tw-py-2 hover:tw-bg-primary hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out"
            data-action-id="staking-stake-extend-cancelButton"
          >
            {t(translations.stake.actions.cancel)}
          </button>
        </div>
      </form>
    </>
  );
}
