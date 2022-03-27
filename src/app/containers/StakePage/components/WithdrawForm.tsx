import React, { FormEvent, useCallback, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { handleNumberInput } from 'utils/helpers';
import { numberFromWei, toWei } from 'utils/blockchain/math-helpers';
import { CacheCallResponse } from 'app/hooks/useCacheCall';
import { contractReader } from 'utils/sovryn/contract-reader';
import { useAccount } from 'app/hooks/useAccount';
import { weiToNumberFormat } from 'utils/display-text/format';
import { WithdrawConfirmationForm } from './WithdrawConfimationForm';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { discordInvite } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';

interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  withdrawAmount: string;
  until: number;
  onChangeAmount: (value: string) => void;
  balanceOf: CacheCallResponse;
  isValid: boolean;
  votePower?: number;
  onCloseModal: () => void;
}

export function WithdrawForm(props: Props) {
  const { t } = useTranslation();
  const account = useAccount();
  const { checkMaintenance, States } = useMaintenance();
  const unstakingLocked = checkMaintenance(States.UNSTAKING);
  const [forfeitWithdraw, setForfeitWithdraw] = useState<number>(0);
  const [forfeitPercent, setForfeitPercent] = useState<number>(0);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [withdrawFormConfirmation, setWithdrawFormConfirmation] = useState(
    false,
  );

  const getEvent = useCallback(
    async amount => {
      setLoadingWithdraw(true);
      await contractReader
        .call(
          'staking',
          'getWithdrawAmounts',
          [toWei(amount), Number(props.until)],
          account,
        )
        .then(res => {
          setForfeitWithdraw(res[1]);
          setForfeitPercent(
            Number(((Number(res[1]) / Number(toWei(amount))) * 100).toFixed(1)),
          );
          setLoadingWithdraw(false);
        })
        .catch(error => {
          setLoadingWithdraw(false);
          console.log('forfeit error', error);
          return false;
        });
    },
    [account, props.until],
  );

  return (
    <>
      <form onSubmit={props.handleSubmit}>
        {withdrawFormConfirmation ? (
          <WithdrawConfirmationForm
            forfeit={forfeitWithdraw}
            until={props.until}
            onCloseModal={() => props.onCloseModal()}
          />
        ) : (
          <>
            <h3 className="tw-text-center tw-mb-10 tw-leading-10 tw-text-3xl">
              {t(translations.stake.withdraw.title)}
            </h3>
            <div className="tw-mb-9 md:tw-px-9 tw-tracking-normal">
              <label
                className="tw-leading-4 tw-block tw-text-sov-white tw-text-md tw-font-medium tw-mb-2"
                htmlFor="amount"
              >
                {t(translations.stake.withdraw.amountCurrentlyStaked)}:
              </label>
              <div className="tw-flex tw-space-x-4 tw-relative">
                <input
                  readOnly
                  className="tw-appearance-none tw-border tw-border-solid tw-border-sov-white tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-pr-12 tw-pl-8 tw-bg-black tw-text-sov-white tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
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
                {t(translations.stake.withdraw.amountToUnstake)}:
              </label>
              <div className="tw-flex tw-space-x-4 tw-relative">
                <input
                  className="tw-appearance-none tw-border tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-pr-12 tw-pl-8 tw-bg-sov-white tw-text-black tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
                  id="amountAdd"
                  type="text"
                  placeholder={t(translations.amountField.placeholder)}
                  value={props.withdrawAmount}
                  onChange={e => {
                    props.onChangeAmount(handleNumberInput(e));
                    getEvent(handleNumberInput(e).toString());
                  }}
                />
                <span className="tw-text-black tw-text-md tw-font-semibold tw-absolute tw-top-3 tw-right-3 tw-leading-4">
                  {t(translations.stake.sov)}
                </span>
              </div>
              <div className="tw-flex tw-rounded tw-border tw-border-secondary tw-mt-4">
                <div
                  onClick={() => {
                    let num = Number(props.amount) / 10;
                    props.onChangeAmount(num.toString());
                    getEvent(num.toString());
                  }}
                  className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-secondary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-secondary tw-tracking-tighter tw-border-secondary"
                >
                  10%
                </div>
                <div
                  onClick={() => {
                    let num = Number(props.amount) / 4;
                    props.onChangeAmount(num.toString());
                    getEvent(num.toString());
                  }}
                  className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-secondary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-secondary tw-tracking-tighter tw-border-secondary"
                >
                  25%
                </div>
                <div
                  onClick={() => {
                    let num = Number(props.amount) / 2;
                    props.onChangeAmount(num.toString());
                    getEvent(num.toString());
                  }}
                  className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-secondary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-secondary tw-tracking-tighter tw-border-secondary"
                >
                  50%
                </div>
                <div
                  onClick={() => {
                    let num = (Number(props.amount) / 4) * 3;
                    props.onChangeAmount(num.toString());
                    getEvent(num.toString());
                  }}
                  className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-secondary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-secondary tw-tracking-tighter tw-border-secondary"
                >
                  75%
                </div>
                <div
                  onClick={() => {
                    props.onChangeAmount(props.amount);
                    getEvent(props.amount.toString());
                  }}
                  className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-secondary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-text-sm tw-text-secondary tw-tracking-tighter"
                >
                  100%
                </div>
              </div>
              {Number(props.until) > Math.round(new Date().getTime() / 1e3) && (
                <>
                  <label
                    className="tw-block tw-text-sov-white tw-text-md tw-font-medium tw-mb-2 tw-mt-8"
                    htmlFor="unstake"
                  >
                    {t(translations.stake.withdraw.forfeit)}:
                  </label>
                  <div className="tw-flex tw-space-x-4">
                    <input
                      readOnly
                      className={`tw-border tw-border-gray-3 tw-border-opacity-100 tw-border-solid tw-text-sov-white tw-appearance-none tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-3 tw-bg-transparent tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline ${
                        loadingWithdraw && 'tw-skeleton'
                      }`}
                      id="unstake"
                      type="text"
                      placeholder="0"
                      value={
                        forfeitPercent +
                        '% ≈ ' +
                        numberFromWei(forfeitWithdraw).toFixed(2) +
                        ' SOV'
                      }
                    />
                  </div>
                </>
              )}

              <div className="tw-block tw-text-sov-white tw-text-md tw-font-normal tw-mb-2 tw-mt-7">
                <TxFeeCalculator
                  args={[
                    toWei(props.withdrawAmount),
                    Number(props.until),
                    account,
                  ]}
                  methodName="withdraw"
                  contractName="staking"
                />
              </div>
            </div>
            {unstakingLocked && (
              <ErrorBadge
                content={
                  <Trans
                    i18nKey={translations.maintenance.unstakingModal}
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
              {Number(props.until) > Math.round(new Date().getTime() / 1e3) ? (
                <button
                  type="button"
                  className={`tw-uppercase tw-w-full tw-text-black tw-bg-primary tw-text-xl tw-font-extrabold tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out ${
                    (!props.isValid ||
                      loadingWithdraw ||
                      forfeitWithdraw === 0 ||
                      unstakingLocked) &&
                    'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-opacity-100'
                  }`}
                  disabled={
                    !props.isValid ||
                    loadingWithdraw ||
                    forfeitWithdraw === 0 ||
                    unstakingLocked
                  }
                  onClick={e => {
                    e.preventDefault();
                    setWithdrawFormConfirmation(true);
                  }}
                >
                  {t(translations.stake.actions.confirm)}
                </button>
              ) : (
                <button
                  type="submit"
                  className={`tw-uppercase tw-w-full tw-text-black tw-bg-primary tw-text-xl tw-font-extrabold tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out ${
                    (!props.isValid || unstakingLocked) &&
                    'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-opacity-100'
                  }`}
                  disabled={!props.isValid || unstakingLocked}
                >
                  {t(translations.stake.actions.confirm)}
                </button>
              )}
              <button
                type="button"
                onClick={() => props.onCloseModal()}
                className="tw-border tw-border-primary tw-rounded-lg tw-text-primary tw-uppercase tw-w-full tw-text-xl tw-font-extrabold tw-px-4 tw-py-2 hover:tw-bg-primary hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out"
              >
                {t(translations.stake.actions.cancel)}
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );
}
