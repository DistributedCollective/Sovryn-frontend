import React, { FormEvent } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { handleNumberInput } from 'utils/helpers';
import { numberFromWei, fromWei } from 'utils/blockchain/math-helpers';
import { CacheCallResponse } from 'app/hooks/useCacheCall';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { StakingDateSelector } from 'app/components/StakingDateSelector';
import { useAccount } from 'app/hooks/useAccount';
import { ethGenesisAddress, discordInvite } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import '../../../components/Header/index.scss';

interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  timestamp?: number;
  onChangeAmount: (value: string) => void;
  onChangeTimestamp: (value: number) => void;
  sovBalanceOf: CacheCallResponse;
  isValid: boolean;
  kickoff: CacheCallResponse;
  stakes: string[];
  votePower?: number;
  onCloseModal: () => void;
}

export function StakeForm(props: Props) {
  const { t } = useTranslation();
  const account = useAccount();
  const { checkMaintenance, States } = useMaintenance();
  const stakingLocked = checkMaintenance(States.STAKING);

  const txConf = {
    gas: 250000,
  };

  return (
    <>
      <h3 className="tw-text-center tw-mb-10 tw-leading-10 tw-text-3xl">
        {t(translations.stake.staking.title)}
      </h3>
      <form onSubmit={props.handleSubmit}>
        <div className="tw-mb-9 md:tw-px-8 tw-px-4 tw-tracking-normal">
          <label
            className="tw-leading-4 tw-block tw-text-theme-white tw-text-md tw-font-medium tw-mb-2"
            htmlFor="amount"
          >
            {t(translations.stake.staking.amountToStake)}:
          </label>
          <div className="tw-flex tw-space-x-4 tw-relative">
            <input
              className="tw-appearance-none tw-border tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-14 tw-bg-theme-white tw-text-black tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
              id="amount"
              type="text"
              value={props.amount}
              placeholder={t(translations.stake.staking.amountPlaceholder)}
              onChange={e => props.onChangeAmount(handleNumberInput(e))}
            />
            <span className="tw-text-black tw-text-md tw-font-semibold tw-absolute tw-top-3 tw-right-5 tw-leading-4">
              {t(translations.stake.sov)}
            </span>
          </div>
          <div className="tw-flex tw-rounded tw-border tw-border-theme-blue tw-mt-4">
            <div
              onClick={() =>
                props.onChangeAmount(
                  fromWei((props.sovBalanceOf.value as any) / 10),
                )
              }
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-theme-blue tw-tracking-tighter tw-border-theme-blue"
            >
              10%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(
                  fromWei((props.sovBalanceOf.value as any) / 4),
                )
              }
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-theme-blue tw-tracking-tighter tw-border-theme-blue"
            >
              25%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(
                  fromWei((props.sovBalanceOf.value as any) / 2),
                )
              }
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-theme-blue tw-tracking-tighter tw-border-theme-blue"
            >
              50%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(
                  fromWei(((props.sovBalanceOf.value as any) / 4) * 3),
                )
              }
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-theme-blue tw-tracking-tighter tw-border-theme-blue"
            >
              75%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(fromWei(props.sovBalanceOf.value))
              }
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-text-sm tw-text-theme-blue tw-tracking-tighter"
            >
              100%
            </div>
          </div>

          <StakingDateSelector
            title="Select new date"
            kickoffTs={Number(props.kickoff.value)}
            value={props.timestamp}
            onClick={value => props.onChangeTimestamp(value)}
            stakes={props.stakes}
          />

          <label
            className="tw-block tw-text-theme-white tw-text-md tw-font-medium tw-mb-2 tw-mt-8"
            htmlFor="voting-power"
          >
            {t(translations.stake.staking.votingPowerReceived)}:
          </label>
          <div className="tw-flex tw-space-x-4 tw-mb-3">
            <input
              readOnly
              className="tw-border tw-border-gray-200 tw-border-opacity-100 tw-border-solid tw-text-theme-white tw-appearance-none tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-3 tw-bg-transparent tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
              id="voting-power"
              type="text"
              placeholder="0"
              value={numberFromWei(props.votePower)}
            />
          </div>
          <TxFeeCalculator
            args={[
              Number(props.amount).toFixed(0).toString(),
              props.timestamp,
              account,
              ethGenesisAddress,
            ]}
            txConfig={txConf}
            methodName="stake"
            contractName="staking"
          />
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
                    className="tw-text-Red tw-text-xs tw-underline hover:tw-no-underline"
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
            className={`tw-uppercase tw-w-full tw-text-black tw-bg-gold tw-bg-opacity-1 tw-text-xl tw-font-extrabold tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out ${
              (!props.isValid || stakingLocked) &&
              'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-opacity-100'
            }`}
            disabled={!props.isValid || stakingLocked}
          >
            {t(translations.stake.actions.confirm)}
          </button>
          <button
            type="button"
            onClick={() => props.onCloseModal()}
            className="tw-border tw-border-gold tw-rounded-lg tw-text-gold tw-uppercase tw-w-full tw-text-xl tw-font-extrabold tw-px-4 tw-py-2 hover:tw-bg-gold hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out"
          >
            {t(translations.stake.actions.cancel)}
          </button>
        </div>
      </form>
    </>
  );
}
