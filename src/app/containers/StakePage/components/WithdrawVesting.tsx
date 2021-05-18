import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { useAccount } from 'app/hooks/useAccount';
import { useGetUnlockedVesting } from '../../../hooks/staking/useGetUnlockedVesting';
import { vesting_withdraw } from 'utils/blockchain/requests/vesting';
import { isAddress } from 'web3-utils';
interface Props {
  vesting: string;
  onCloseModal: () => void;
}

export function WithdrawVesting(props: Props) {
  const { t } = useTranslation();
  const account = useAccount();
  const [address, setAddress] = useState(account);
  const [sending, setSending] = useState(false);
  const { value, loading } = useGetUnlockedVesting(props.vesting);

  const validate = () => {
    return (
      !loading && !sending && value !== '0' && isAddress(address.toLowerCase())
    );
  };

  const submitForm = useCallback(
    async e => {
      e.preventDefault();
      setSending(true);
      try {
        await vesting_withdraw(
          props.vesting.toLowerCase(),
          address.toLowerCase(),
          account.toLowerCase(),
        );
        props.onCloseModal();
        setSending(false);
      } catch (e) {
        console.error(e);
        setSending(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, account, props.vesting],
  );

  return (
    <>
      <h3 className="tw-text-center tw-mb-10 tw-leading-10 tw-text-3xl">
        {t(translations.stake.withdraw.title)}
      </h3>
      <form onSubmit={submitForm}>
        <div className="tw-mb-9 md:tw-px-9 tw-tracking-normal">
          <label
            className="tw-leading-4 tw-block tw-text-theme-white tw-text-md tw-font-medium tw-mb-2"
            htmlFor="address"
          >
            {t(translations.stake.withdraw.receiveSovAt)}:
          </label>
          <div className="tw-flex tw-space-x-4 tw-relative">
            <input
              className="tw-appearance-none tw-border tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-2 tw-bg-theme-white tw-text-black tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
              id="address"
              type="text"
              value={address}
              placeholder="Enter or paste address"
              onChange={e => setAddress(e.currentTarget.value)}
            />
          </div>

          <label
            className="tw-block tw-text-theme-white tw-text-md tw-font-medium tw-mb-2 tw-mt-8"
            htmlFor="voting-power"
          >
            {t(translations.stake.withdraw.unlockedSov)}:
          </label>
          <div className="tw-flex tw-space-x-4">
            <div className="tw-border tw-text-theme-white tw-appearance-none tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-3 tw-bg-transparent tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline">
              {loading ? 'Loading...' : numberFromWei(value)}
            </div>
          </div>

          <p className="tw-block tw-text-theme-white tw-text-md tw-font-light tw-mb-2 tw-mt-7">
            {t(translations.stake.txFee)}: 0.0006 rBTC
          </p>
        </div>

        <div className="tw-grid tw-grid-rows-1 tw-grid-flow-col tw-gap-4">
          <button
            type="submit"
            className={`tw-uppercase tw-w-full tw-text-black tw-bg-gold tw-text-xl tw-font-extrabold tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out ${
              !validate() && 'tw-bg-opacity-25'
            }`}
            disabled={!validate()}
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
