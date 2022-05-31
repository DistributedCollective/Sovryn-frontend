import React, { FormEvent, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { handleNumberInput } from 'utils/helpers';
import { numberFromWei, toWei, fromWei } from 'utils/blockchain/math-helpers';
import { weiToNumberFormat } from 'utils/display-text/format';
import { CacheCallResponse } from 'app/hooks/useCacheCall';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { useAccount } from 'app/hooks/useAccount';
import { TxType } from 'store/global/transactions-store/types';
import { ethGenesisAddress, discordInvite, gasLimit } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { AvailableBalance } from '../../../components/AvailableBalance';
import { Asset } from 'types/asset';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';

interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  timestamp?: number;
  onChangeAmount: (value: string) => void;
  sovBalance: string;
  balanceOf: CacheCallResponse;
  isValid: boolean;
  votePower?: number;
  onCloseModal: () => void;
}

export function IncreaseStakeForm(props: Props) {
  const { t } = useTranslation();
  const account = useAccount();
  const { checkMaintenance, States } = useMaintenance();
  const stakingLocked = checkMaintenance(States.STAKING);
  const [initialStep, setInitialStep] = useState(true);
  const txConf = {
    gas: gasLimit[TxType.STAKING_INCREASE_STAKE],
  };

  useEffect(() => {
    //setting the max value for staking by default
    if (initialStep) props.onChangeAmount(fromWei(props.sovBalance));
    setInitialStep(false);
  }, [props, initialStep]);

  return (
    <>
      <h3 className="tw-text-center tw-mb-10 tw-leading-10 tw-text-3xl">
        {t(translations.stake.increase.title)}
      </h3>
      <form onSubmit={props.handleSubmit}>
        <div className="tw-mb-9 md:tw-px-9 tw-tracking-normal">
          <label
            className="tw-leading-4 tw-block tw-text-sov-white tw-text-md tw-font-medium tw-mb-2"
            htmlFor="amount"
          >
            {t(translations.stake.increase.currentlyStaked)}:
          </label>
          <div className="tw-flex tw-space-x-4 tw-relative">
            <input
              readOnly
              className="tw-appearance-none tw-border tw-border-sov-white tw-border-solid tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-pr-12 tw-pl-8 tw-bg-black tw-text-sov-white tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
              id="amount"
              type="text"
              defaultValue={weiToNumberFormat(toWei(props.amount), 6)}
            />
            <span className="tw-text-sov-white tw-text-md tw-font-semibold tw-absolute tw-top-3 tw-right-3 tw-leading-4">
              {t(translations.stake.sov)}
            </span>
          </div>

          <label
            className="tw-leading-4 tw-block tw-text-sov-white tw-text-md tw-font-medium tw-mb-2 tw-mt-8"
            htmlFor="amountAdd"
          >
            {t(translations.stake.increase.amountToAdd)}:
          </label>
          <div className="tw-flex tw-space-x-4 tw-relative">
            <input
              className="tw-appearance-none tw-border tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-pr-12 tw-pl-8 tw-bg-sov-white tw-text-black tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
              id="amountAdd"
              type="text"
              placeholder={t(translations.stake.staking.amountPlaceholder)}
              value={props.amount}
              onChange={e => props.onChangeAmount(handleNumberInput(e))}
              data-action-id="staking-stake-increase-amountInput"
            />
            <span className="tw-text-black tw-text-md tw-font-semibold tw-absolute tw-top-3 tw-right-3 tw-leading-4">
              {t(translations.stake.sov)}
            </span>
          </div>
          <div className="tw-flex tw-rounded tw-border tw-border-secondary tw-mt-4 tw-mb-2">
            <div
              onClick={() =>
                props.onChangeAmount(fromWei(Number(props.sovBalance) / 10))
              }
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-secondary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-secondary tw-tracking-tighter tw-border-secondary"
            >
              10%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(fromWei(Number(props.sovBalance) / 4))
              }
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-secondary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-secondary tw-tracking-tighter tw-border-secondary"
            >
              25%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(fromWei(Number(props.sovBalance) / 2))
              }
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-secondary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-secondary tw-tracking-tighter tw-border-secondary"
            >
              50%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(
                  fromWei((Number(props.sovBalance) / 4) * 3),
                )
              }
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-secondary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-secondary tw-tracking-tighter tw-border-secondary"
            >
              75%
            </div>
            <div
              onClick={() => props.onChangeAmount(fromWei(props.sovBalance))}
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-secondary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-text-sm tw-text-secondary tw-tracking-tighter"
            >
              100%
            </div>
          </div>

          <div className="tw-flex tw-text-xs">
            <AvailableBalance asset={Asset.SOV} />
            <div className="tw-ml-1">{t(translations.stake.sov)}</div>
          </div>

          <label
            className="tw-block tw-text-sov-white tw-text-md tw-font-medium tw-mb-2 tw-mt-8"
            htmlFor="voting-power"
          >
            {t(translations.stake.increase.newVotingPower)}:
          </label>
          <div className="tw-flex tw-space-x-4 tw-mb-3">
            <input
              readOnly
              className="tw-border tw-border-gray-3 tw-border-opacity-100 tw-border-solid tw-text-sov-white tw-appearance-none tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-3 tw-bg-transparent tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
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
            data-action-id="staking-stake-increase-confirmButton"
          >
            {t(translations.stake.actions.confirm)}
          </button>
          <button
            type="button"
            onClick={() => props.onCloseModal()}
            className="tw-border tw-border-primary tw-rounded-lg tw-text-primary tw-uppercase tw-w-full tw-text-xl tw-font-extrabold tw-px-4 tw-py-2 hover:tw-bg-primary hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out"
            data-action-id="staking-stake-increase-cancelButton"
          >
            {t(translations.stake.actions.cancel)}
          </button>
        </div>
      </form>
    </>
  );
}
