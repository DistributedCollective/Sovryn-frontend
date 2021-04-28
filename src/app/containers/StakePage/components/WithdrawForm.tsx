import React, { FormEvent, useCallback, useState } from 'react';
import { handleNumberInput, numberFromWei, toWei } from 'utils/helpers';
import { CacheCallResponse } from 'app/hooks/useCacheCall';
import { contractReader } from 'utils/sovryn/contract-reader';
import { useAccount } from 'app/hooks/useAccount';
interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  withdrawAmount: number;
  until: number;
  onChangeAmount: (value: number) => void;
  sovBalanceOf: CacheCallResponse;
  balanceOf: CacheCallResponse;
  isValid: boolean;
  votePower?: number;
  onCloseModal: () => void;
}

export function WithdrawForm(props: Props) {
  const account = useAccount();
  const [forfeitWithdraw, setForfeitWithdraw] = useState<number>(0);
  const [forfeitPercent, setForfeitPercent] = useState<number>(0);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);

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
          return false;
        });
    },
    [account, props.until],
  );

  return (
    <>
      <h3 className="tw-text-center tw-mb-10 tw-leading-10 tw-text-3xl">
        Unstake SOV
      </h3>
      <form onSubmit={props.handleSubmit}>
        <div className="tw-mb-9 md:tw-px-9 tw-tracking-normal">
          <label
            className="tw-leading-4 tw-block tw-text-theme-white tw-text-md tw-font-medium tw-mb-2"
            htmlFor="amount"
          >
            Amount Currently Staked:
          </label>
          <div className="tw-flex tw-space-x-4 tw-relative">
            <input
              readOnly
              className="tw-appearance-none tw-border tw-border-solid tw-border-theme-white tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-14 tw-bg-black tw-text-theme-white tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
              id="amount"
              type="text"
              defaultValue={props.amount}
            />
            <span className="tw-text-theme-white tw-text-md tw-font-semibold tw-absolute tw-top-3 tw-right-5 tw-leading-4">
              SOV
            </span>
          </div>

          <label
            className="tw-leading-4 tw-block tw-text-theme-white tw-text-md tw-font-medium tw-mb-2 tw-mt-8"
            htmlFor="amountAdd"
          >
            Amount to Unstake:
          </label>
          <div className="tw-flex tw-space-x-4 tw-relative">
            <input
              className="tw-appearance-none tw-border tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-14 tw-bg-theme-white tw-text-black tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
              id="amountAdd"
              type="text"
              placeholder="Enter amount"
              value={props.withdrawAmount}
              onChange={e => {
                props.onChangeAmount(handleNumberInput(e));
                getEvent(handleNumberInput(e));
              }}
            />
            <span className="tw-text-black tw-text-md tw-font-semibold tw-absolute tw-top-3 tw-right-5 tw-leading-4">
              SOV
            </span>
          </div>
          <div className="tw-flex tw-rounded tw-border tw-border-theme-blue tw-mt-4">
            <div
              onClick={() => {
                let num = (Number(props.amount) / 10).toFixed(2);
                props.onChangeAmount(Number(num));
                getEvent(Number(num));
              }}
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-theme-blue tw-tracking-tighter tw-border-theme-blue"
            >
              10%
            </div>
            <div
              onClick={() => {
                let num = (Number(props.amount) / 4).toFixed(2);
                props.onChangeAmount(Number(num));
                getEvent(Number(num));
              }}
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-theme-blue tw-tracking-tighter tw-border-theme-blue"
            >
              25%
            </div>
            <div
              onClick={() => {
                let num = (Number(props.amount) / 2).toFixed(2);
                props.onChangeAmount(Number(num));
                getEvent(Number(num));
              }}
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-theme-blue tw-tracking-tighter tw-border-theme-blue"
            >
              50%
            </div>
            <div
              onClick={() => {
                let num = ((Number(props.amount) / 4) * 3).toFixed(2);
                props.onChangeAmount(Number(num));
                getEvent(Number(num));
              }}
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-border-r tw-text-sm tw-text-theme-blue tw-tracking-tighter tw-border-theme-blue"
            >
              75%
            </div>
            <div
              onClick={() => {
                props.onChangeAmount(Number(props.amount));
                getEvent(Number(props.amount));
              }}
              className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-w-1/5 tw-py-1 tw-text-center tw-text-sm tw-text-theme-blue tw-tracking-tighter"
            >
              100%
            </div>
          </div>
          {Number(props.until) > Math.round(new Date().getTime() / 1e3) && (
            <>
              <label
                className="tw-block tw-text-theme-white tw-text-md tw-font-medium tw-mb-2 tw-mt-8"
                htmlFor="unstake"
              >
                Early unstake forfeit:
              </label>
              <div className="tw-flex tw-space-x-4">
                <input
                  readOnly
                  className={`tw-border tw-border-gray-200 tw-border-opacity-100 tw-border-solid tw-text-theme-white tw-appearance-none tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-3 tw-bg-transparent tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline ${
                    loadingWithdraw && 'skeleton'
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

          <p className="tw-block tw-text-theme-white tw-text-md tw-font-light tw-mb-2 tw-mt-7">
            Tx Fee: 0.0006 rBTC
          </p>
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
            Confirm
          </button>
          <button
            type="button"
            onClick={() => props.onCloseModal()}
            className="tw-border tw-border-gold tw-rounded-lg tw-text-gold tw-uppercase tw-w-full tw-text-xl tw-font-extrabold tw-px-4 tw-py-2 hover:tw-bg-gold hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
