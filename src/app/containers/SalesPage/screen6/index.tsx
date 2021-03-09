import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';
import SalesButton from '../../../components/SalesButton';
import { useDispatch, useSelector } from 'react-redux';
import BackButton from '../BackButton';
import Loader from '../loader';

import { actions } from '../slice';
import { selectSalesPage } from '../selectors';
import {
  isAddress,
  toChecksumAddress,
  validateEmail,
} from '../../../../utils/helpers';
import { media } from 'styles/media';
import { useAccount } from '../../../hooks/useAccount';

const StyledContent = styled.div`
  background: var(--sales-background);
  max-width: 1235px;
  min-height: 620px;
  margin: 40px auto;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: end;
  flex-direction: column;
  position: relative;
  padding: 36px 15px;
  .content-header {
    font-size: 28px;
    text-align: center;
    margin-bottom: 3.5rem;
    margin-top: 3rem;
  }
  a {
    margin-top: 110px;
    color: var(--gold);
    font-weight: normal;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 36px;
    min-width: 296px;
    label {
      font-size: 14px;
      margin-bottom: 8px;
      line-height: 17px;
    }
  }
`;

const StyledInput = styled.input.attrs(_ => ({ type: 'text' }))`
  border: 1px solid #707070;
  background: #f4f4f4;
  border-radius: 8px;
  height: 40px;
  width: 100%;
  text-align: left;
  color: black;
  padding: 0 10px;
  ${media.xl`
    max-width: 296px;
  `}
`;

const StyledTextArea = styled.textarea`
  border: 1px solid #707070;
  background: #f4f4f4;
  border-radius: 8px;
  height: 100px;
  color: black;
  padding: 10px;
  margin-top: 2px;
`;

interface StyledProps {
  active: boolean;
}
const StyledButtonGroup = styled.div`
  border: 1px solid var(--gold);
  background: var(--gold5);
  border-radius: 10px;
  color: var(--gold);
  min-width: 48px;
  height: 48px;
  font-family: 'Montserrat';
  font-weight: 300;
  letter-spacing: 0px;
  font-size: 18px;
  text-align: center;
  text-transform: inherit;
  transition: background 0.3s;
  padding: 0 4.2%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  ${media.xl`
    max-width: 130px;
    width: 100%;
    height: 50px;
    padding: 2px 20px 2px 20px;

    &:hover, &:focus {
      &:not([disabled]) {
        background: var(--gold25) !important;
      }
    }
    &:active:hover {
      &:not([disabled]) {
        background: var(--gold50) !important;
      }
    }
    `}
  ${(props: StyledProps) =>
    props.active &&
    css`
      background: var(--gold50) !important;
    `}
`;

export default function Screen6() {
  const dispatch = useDispatch();
  const account = useAccount();
  const [amount, setAmount] = useState('0.03');
  const [address, setAddress] = useState(account);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [note, setNote] = useState('');

  const { requestAccessLoading, requestAccessError } = useSelector(
    selectSalesPage,
  );

  const submitCode = () => {
    dispatch(
      actions.requestAccess({
        address: address.toLowerCase(),
        email,
        discord: username,
        amount,
        comment: note,
      }),
    );
  };

  const addressValid = isAddress(toChecksumAddress(address));
  const emailValid = validateEmail(email);
  const valid = addressValid && !!address && !!email && emailValid;

  return (
    <>
      {!requestAccessLoading ? (
        <StyledContent>
          <div className="tw-flex tw-flex-row">
            <BackButton />
          </div>
          <p className="content-header lg:tw-mt-0 sm:tw-mt-5">
            Please fill out this form to request access to the
            <br />
            SOV* Genesis Pre-Order{' '}
          </p>
          <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-mb-6">
            <div className="lg:tw-col-span-6 md:tw-col-span-12 lg:tw-flex lg:flex-column tw-items-center">
              <div className="lg:tw-pl-1">
                <div className="form-group">
                  <label htmlFor="address">Wallet to receive access</label>
                  <StyledInput
                    name="address"
                    id="address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                  {address.length > 1 && !addressValid && (
                    <small className="tw-text-muted">
                      Enter valid RSK wallet address.
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Enter email</label>
                  <StyledInput
                    name="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  {!!email && !emailValid && (
                    <small className="tw-text-muted">
                      Enter valid email address.
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="username">
                    Enter discord username (optional)
                  </label>
                  <StyledInput
                    name="username"
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="lg:tw-col-span-5 md:tw-col-span-12 lg:tw-5">
              <div>
                <p className="tw-mb-2">Select limit required</p>
                <div className="tw-flex tw-justify-between tw-mb-6">
                  <StyledButtonGroup
                    active={amount === '0.03'}
                    onClick={() => setAmount('0.03')}
                  >
                    0.03BTC
                  </StyledButtonGroup>
                  <StyledButtonGroup
                    active={amount === '0.1'}
                    onClick={() => setAmount('0.1')}
                  >
                    0.1BTC
                  </StyledButtonGroup>
                  <StyledButtonGroup
                    active={amount === '2.0'}
                    onClick={() => setAmount('2.0')}
                  >
                    2.0BTC
                  </StyledButtonGroup>
                </div>

                <div className="form-group">
                  <label htmlFor="note" className="tw-ml-1">
                    In a few words please explain why you should be chosen to
                    receive a higher limit of SOV, and what interests you about
                    being vested in the SOVRYN system
                  </label>
                  <StyledTextArea
                    name="note"
                    id="note"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {requestAccessError && (
            <div className="tw-text-danger">{requestAccessError}</div>
          )}

          <SalesButton
            text={'Submit for Access'}
            onClick={submitCode}
            loading={requestAccessLoading}
            disabled={requestAccessLoading || !valid}
          />
        </StyledContent>
      ) : (
        <Loader
          content={
            <p className="content-header">
              We are currently processing your request
            </p>
          }
        />
      )}
    </>
  );
}
