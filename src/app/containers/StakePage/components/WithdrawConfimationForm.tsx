import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import styled from 'styled-components/macro';
import dayjs from 'dayjs';
import iconReject from 'assets/images/failed-tx.svg';
import { discordInvite } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';

interface Props {
  forfeit: number;
  until: number;
  onCloseModal: () => void;
}

export function WithdrawConfirmationForm(props: Props) {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const unstakingLocked = checkMaintenance(States.UNSTAKING);
  return (
    <>
      <button
        data-close=""
        className="dialog-close"
        onClick={() => {
          props.onCloseModal();
        }}
      >
        <span className="tw-sr-only">
          {t(translations.stake.withdraw.closeDialog)}
        </span>
      </button>
      <h3 className="tw-text-center tw-mb-10 tw-leading-8 tw-text-2xl tw-normal-case tw-mt-4">
        {t(translations.stake.withdraw.reallyUnstake)}
      </h3>
      <div className="tw-mb-9 md:tw-px-9 tw-tracking-normal">
        <StyledStatus>
          <img src={iconReject} alt="attention" className="tw-m-auto" />
        </StyledStatus>
        <p className="tw-text-red tw-text-center">
          {t(translations.stake.withdraw.stakeUnlockUntil)}:
        </p>
        <div className="tw-text-center tw-text-xl tw-font-normal tw-mb-8 tw-mt-4">
          {dayjs
            .tz(props.until * 1e3, 'UTC')
            .tz(dayjs.tz.guess())
            .format('L - LTS Z')}
        </div>

        {props.forfeit === 0 ? (
          <>
            <p className="tw-text-red tw-text-center">
              {t(translations.stake.withdraw.penaltyZero)}
            </p>
          </>
        ) : (
          <>
            <p className="tw-text-red tw-text-center">
              {t(translations.stake.withdraw.penalty)}:
            </p>
            <div className="tw-text-center tw-text-lg tw-font-semibold">
              {numberFromWei(props.forfeit).toFixed(2) + ' SOV'}
            </div>
          </>
        )}
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
                  className="tw-text-Red tw-text-xs tw-underline hover:tw-no-underline"
                >
                  x
                </a>,
              ]}
            />
          }
        />
      )}
      <div className="md:tw-px-16 tw-mb-8">
        <button
          type="submit"
          className={`tw-uppercase tw-mb-5 tw-w-full tw-text-black tw-bg-gold tw-text-xl tw-font-extrabold tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out ${
            unstakingLocked &&
            'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-opacity-100'
          }`}
          disabled={unstakingLocked}
        >
          {t(translations.stake.withdraw.unstake)}
        </button>
        <button
          type="button"
          onClick={() => {
            props.onCloseModal();
          }}
          className="tw-border tw-border-gold tw-rounded-lg tw-text-gold tw-uppercase tw-w-full tw-text-xl tw-font-extrabold tw-px-4 tw-py-2 hover:tw-bg-gold hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out"
        >
          {t(translations.stake.actions.cancel)}
        </button>
      </div>
    </>
  );
}

const StyledStatus = styled.div`
  margin: 0 auto 1.5rem;
  text-align: center;
  img {
    width: 4rem;
    height: 4rem;
  }
`;
