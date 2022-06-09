import React, { useCallback, useState } from 'react';
import { isAddress } from 'web3-utils';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { useAccount } from 'app/hooks/useAccount';
import { useGetUnlockedVesting } from '../../../hooks/staking/useGetUnlockedVesting';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { discordInvite } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { VestGroup } from 'app/components/UserAssets/Vesting/types';

interface IWithdrawVestingProps {
  vesting: string;
  vestingType: VestGroup;
  onCloseModal: () => void;
  onWithdraw: (receiver: string) => void;
}

export const WithdrawVesting: React.FC<IWithdrawVestingProps> = ({
  vesting,
  vestingType,
  onCloseModal,
  onWithdraw,
}) => {
  const { t } = useTranslation();
  const account = useAccount();
  const { checkMaintenance, States } = useMaintenance();
  const withdrawVestsLocked = checkMaintenance(States.WITHDRAW_VESTS);
  const [address, setAddress] = useState(account);
  const { value, loading } = useGetUnlockedVesting(
    'staking',
    vesting,
    vestingType,
  );

  const validate = () => {
    return !loading && value !== '0' && isAddress(address.toLowerCase());
  };

  const submitForm = useCallback(
    async e => {
      e.preventDefault();
      onWithdraw(address.toLowerCase());
    },
    [onWithdraw, address],
  );

  return (
    <>
      <h3 className="tw-text-center tw-mb-10 tw-leading-10 tw-text-3xl">
        {t(translations.stake.withdraw.title)}
      </h3>
      <form onSubmit={submitForm}>
        <div className="tw-mb-9 md:tw-px-9 tw-tracking-normal">
          <label
            className="tw-leading-4 tw-block tw-text-sov-white tw-text-md tw-font-medium tw-mb-2"
            htmlFor="address"
          >
            {t(translations.stake.withdraw.receiveSovAt)}:
          </label>
          <div className="tw-flex tw-space-x-4 tw-relative">
            <input
              className="tw-appearance-none tw-border tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-2 tw-bg-sov-white tw-text-black tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
              id="address"
              type="text"
              value={address}
              placeholder="Enter or paste address"
              onChange={e => setAddress(e.currentTarget.value)}
            />
          </div>

          <label
            className="tw-block tw-text-sov-white tw-text-md tw-font-medium tw-mb-2 tw-mt-8"
            htmlFor="voting-power"
          >
            {t(translations.stake.withdraw.unlockedSov)}:
          </label>
          <div className="tw-flex tw-space-x-4 tw-mb-3">
            <div className="tw-border tw-text-sov-white tw-appearance-none tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-3 tw-bg-transparent tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline">
              {loading
                ? t(translations.stake.withdraw.loading)
                : numberFromWei(value)}
            </div>
          </div>
          <TxFeeCalculator
            args={[address.toLowerCase()]}
            methodName="withdrawTokens"
            contractName="vesting"
          />
        </div>
        {withdrawVestsLocked && (
          <ErrorBadge
            content={
              <Trans
                i18nKey={translations.maintenance.withdrawVestsModal}
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
              (!validate() || withdrawVestsLocked) &&
              'tw-bg-opacity-25 tw-cursor-not-allowed'
            }`}
            disabled={!validate() || withdrawVestsLocked}
          >
            {t(translations.stake.actions.confirm)}
          </button>
          <button
            type="button"
            onClick={onCloseModal}
            className="tw-border tw-border-primary tw-rounded-lg tw-text-primary tw-uppercase tw-w-full tw-text-xl tw-font-extrabold tw-px-4 tw-py-2 hover:tw-bg-primary hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out"
          >
            {t(translations.stake.actions.cancel)}
          </button>
        </div>
      </form>
    </>
  );
};
