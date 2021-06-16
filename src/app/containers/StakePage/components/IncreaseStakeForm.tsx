import React, { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { handleNumberInput } from 'utils/helpers';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { CacheCallResponse } from 'app/hooks/useCacheCall';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { useAccount } from 'app/hooks/useAccount';
import { ethGenesisAddress } from 'utils/classifiers';
interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  timestamp?: number;
  onChangeAmount: (value: string) => void;
  sovBalanceOf: CacheCallResponse;
  balanceOf: CacheCallResponse;
  isValid: boolean;
  votePower?: number;
  onCloseModal: () => void;
}

export function IncreaseStakeForm(props: Props) {
  const { t } = useTranslation();
  const account = useAccount();
  const txConf = {
    gas: 250000,
  };

  return (
    <>
      <h3 className="tw-text-center tw-mb-10 tw-leading-10 tw-text-3xl">
        {t(translations.stake.increase.title)}
      </h3>
      <form onSubmit={props.handleSubmit}>
        <div className="tw-mb-9 md:tw-px-9 tw-tracking-normal">
          <label
            className="tw-leading-4 tw-block tw-text-theme-white tw-text-md tw-font-medium tw-mb-2"
            htmlFor="amount"
          >
            {t(translations.stake.increase.currentlyStaked)}:
          </label>
          <div className="tw-flex tw-space-x-4 tw-relative">
            <input
              readOnly
              className="tw-appearance-none tw-border tw-border-theme-white tw-border-solid tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-14 tw-bg-black tw-text-theme-white tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
              id="amount"
              type="text"
              defaultValue={props.amount}
            />
            <span className="tw-text-theme-white tw-text-md tw-font-semibold tw-absolute tw-top-3 tw-right-5 tw-leading-4">
              {t(translations.stake.sov)}
            </span>
          </div>

          <label
            className="tw-leading-4 tw-block tw-text-theme-white tw-text-md tw-font-medium tw-mb-2 tw-mt-8"
            htmlFor="amountAdd"
          >
            {t(translations.stake.increase.amountToAdd)}:
          </label>
          <div className="tw-flex tw-space-x-4 tw-relative">
            <input
              className="tw-appearance-none tw-border tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-14 tw-bg-theme-white tw-text-black tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
              id="amountAdd"
              type="text"
              placeholder="Enter amount"
              value={props.amount}
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
                  (numberFromWei(props.sovBalanceOf.value) * 0.1).toString(),
                )
              }
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-theme-blue tw-tracking-tighter tw-border-theme-blue"
            >
              10%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(
                  (numberFromWei(props.sovBalanceOf.value) * 0.25).toString(),
                )
              }
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-theme-blue tw-tracking-tighter tw-border-theme-blue"
            >
              25%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(
                  (numberFromWei(props.sovBalanceOf.value) * 0.5).toString(),
                )
              }
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-theme-blue tw-tracking-tighter tw-border-theme-blue"
            >
              50%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(
                  (numberFromWei(props.sovBalanceOf.value) * 0.75).toString(),
                )
              }
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-theme-blue tw-tracking-tighter tw-border-theme-blue"
            >
              75%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(
                  numberFromWei(props.sovBalanceOf.value).toString(),
                )
              }
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-text-sm tw-text-theme-blue tw-tracking-tighter"
            >
              100%
            </div>
          </div>
          <label
            className="tw-block tw-text-theme-white tw-text-md tw-font-medium tw-mb-2 tw-mt-8"
            htmlFor="voting-power"
          >
            {t(translations.stake.increase.newVotingPower)}:
          </label>
          <div className="flex space-x-4 tw-mb-3">
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

        <div className="tw-grid tw-grid-rows-1 tw-grid-flow-col tw-gap-4">
          <button
            type="submit"
            className={`tw-uppercase tw-w-full tw-text-black tw-bg-gold tw-text-xl tw-font-extrabold tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out ${
              !props.isValid &&
              'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-opacity-100'
            }`}
            disabled={!props.isValid}
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
