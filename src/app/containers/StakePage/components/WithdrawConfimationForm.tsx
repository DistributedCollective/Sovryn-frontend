import React from 'react';
import { numberFromWei } from 'utils/helpers';
import styled from 'styled-components/macro';
import moment from 'moment-timezone';
import iconReject from 'assets/images/failed-tx.svg';
interface Props {
  forfeit: number;
  until: number;
  onCloseModal: () => void;
}

export function WithdrawConfirmationForm(props: Props) {
  return (
    <>
      <button
        data-close=""
        className="dialog-close"
        onClick={() => {
          props.onCloseModal();
        }}
      >
        <span className="sr-only">Close Dialog</span>
      </button>
      <h3 className="tw-text-center tw-mb-10 tw-leading-8 tw-text-2xl tw-normal-case tw-mt-4">
        Are you sure you want to unstake?
      </h3>
      <div className="tw-mb-9 md:tw-px-9 tw-tracking-normal">
        <StyledStatus>
          <img src={iconReject} alt="attention" className="tw-m-auto" />
        </StyledStatus>
        <p className="tw-text-red tw-text-center">
          This stake is not scheduled to unlock until:
        </p>
        <div className="tw-text-center tw-text-xl tw-font-normal tw-mb-8 tw-mt-4">
          {moment
            .tz(new Date(parseInt(props.until.toString()) * 1e3), 'GMT')
            .format('DD/MM/YYYY - h:mm:ss a z')}
        </div>

        <p className="tw-text-red tw-text-center">
          Unstaking now invokes a slashing penalty that will cost you:
        </p>
        <div className="tw-text-center tw-text-2xl tw-font-semibold tw-mb-16 tw-mt-3">
          {numberFromWei(props.forfeit).toFixed(2) + ' SOV'}
        </div>
      </div>

      <div className="md:tw-px-16 tw-mb-8">
        <button
          type="submit"
          className="tw-uppercase tw-mb-5 tw-w-full tw-text-black tw-bg-gold tw-text-xl tw-font-extrabold tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out"
        >
          YES, UNSTAKE
        </button>
        <button
          type="button"
          onClick={() => {
            props.onCloseModal();
          }}
          className="tw-border tw-border-gold tw-rounded-lg tw-text-gold tw-uppercase tw-w-full tw-text-xl tw-font-extrabold tw-px-4 tw-py-2 hover:tw-bg-gold hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out"
        >
          Cancel
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
