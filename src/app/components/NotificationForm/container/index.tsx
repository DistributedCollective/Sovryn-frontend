/**
 *
 * NotificationForm
 *
 */

import React, { useReducer, useState } from 'react';
import axios from 'axios';
import { useAccount } from '../../../hooks/useAccount';
import { FormGroup, InputGroup, Checkbox, Icon } from '@blueprintjs/core';
import styled from 'styled-components';
import { media } from '../../../../styles/media';

export function NotificationForm() {
  const mailApiKey = process.env.REACT_APP_MAIL_API_KEY;
  const mailSrv = process.env.REACT_APP_MAIL_SRV;
  const walletAddress = useAccount();

  const initialState = {
    name: '',
    email: '',
    marketing: true,
  };

  const [response, setResponse] = useState('');

  function reducer(state, { field, value }) {
    return {
      ...state,
      [field]: value,
    };
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  const onChange = e => {
    if (e.target.type === 'checkbox') {
      dispatch({ field: e.target.name, value: !state.marketing });
    } else {
      dispatch({ field: e.target.name, value: e.target.value });
    }
  };

  const { name, email } = state;

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post(
        mailSrv + 'addUser',
        {
          name: state.name,
          email: state.email,
          walletAddress: walletAddress,
          doubleOptIn: false,
          preferences: {
            marketing: state.marketing,
            notifications: true,
          },
        },
        {
          headers: {
            Authorization: mailApiKey,
          },
        },
      )
      .then(res => {
        console.log('data: ' + res.data);
        setResponse('success');
      })
      .catch(e => {
        console.log('error on adding user');
        console.log(e);
        setResponse('error');
      });
  };

  function getUser() {
    axios
      .post(
        mailSrv + 'getUser',
        {
          walletAddress: walletAddress,
        },
        {
          headers: {
            Authorization: mailApiKey,
          },
        },
      )
      .then(res => {
        console.log('got user');
        console.log(res.data);
      })
      .catch(e => console.log(e));
  }

  return (
    <div className="mt-5">
      <div className="w-100 sovryn-border p-3 mt-2">
        {response === 'success' ? (
          <div>
            Click the link in the email from us to confirm your email address,
            and you will be signed up for email notifications!
          </div>
        ) : (
          <form>
            <p>
              <span className="text-red mr-2">
                <Icon icon="issue" iconSize={20} />
              </span>
              Want to receive email notifications when your positions are close
              to liquidation?
            </p>
            <div className="row">
              <FormGroup
                label="Name / Pseudonym"
                labelFor="text-input"
                labelInfo="(required)"
                className="col-md-6 col-sm-12"
              >
                <InputGroup
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="name / pseudonym"
                />
              </FormGroup>
              <FormGroup
                label="Email Address"
                labelFor="email-input"
                labelInfo="(required)"
                className="col-md-6 col-sm-12"
              >
                <InputGroup
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="email@email.com"
                />
              </FormGroup>
            </div>
            <div className="row px-3">
              <Checkbox
                name="marketing"
                checked={state.marketing}
                onChange={onChange}
                className="col-md-8 col-sm-12"
              >
                I would like to receive emails about updates and new features
                from Sovryn
              </Checkbox>
              <div className="col-md-4 col-sm-12">
                <StyledButton
                  className="sovryn-border float-right"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!email || !name}
                >
                  Submit
                </StyledButton>
              </div>
              <div className="row">
                {response !== 'success' && response && (
                  <p>There was an error submitting your form</p>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
      <button onClick={getUser}>Get User</button>
    </div>
  );
}

const StyledButton = styled.button`
  color: var(--white);
  background-color: var(--primary);
  border-radius: 20px;
  padding: 5px 30px;
  font-size: 12px;
  &:disabled {
    opacity: 0.7;
  }
  &:hover:not(:disabled) {
    color: var(--Gold);
  }
  ${media.lg`
  font-size: 14px
  `}
`;
