/**
 *
 * NotificationForm
 *
 */

import React, { useReducer, useState, useEffect } from 'react';
import axios from 'axios';
import { useAccount } from '../../../hooks/useAccount';
import { NotificationFormComponent } from '../NotificationFormComponent';

export function NotificationForm() {
  const mailApiKey = process.env.REACT_APP_MAIL_API_KEY;
  const mailSrv = process.env.REACT_APP_MAIL_SRV;

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const walletAddress = useAccount();

  const [foundUser, setFoundUser] = useState({
    email: '',
    id: 0,
    attributes: {
      'DOUBLE_OPT-IN': '',
      NAME: '',
      WALLET_ADDRESS: '',
    },
    createdAt: '',
    emailBlacklisted: false,
    listIds: [],
    modifiedAt: '',
    smsBlacklisted: false,
  });

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

  const addUser = e => {
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

  const updateUser = e => {
    e.preventDefault();
    axios
      .post(
        mailSrv + 'updateUser',
        {
          email: email,
          walletAddress: walletAddress,
        },
        {
          headers: {
            Authorization: mailApiKey,
          },
        },
      )
      .then(res => {
        console.log('updated user');
        setResponse(res.data);
      })
      .catch(e => {
        console.log('Error updating user');
        console.log(e);
      });
  };

  useEffect(() => {
    if (walletAddress) {
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
          console.log('Got user');
          console.log(res.data);
          setFoundUser(res.data);
        })
        .catch(e => console.log(e));
    } else {
      setFoundUser({
        email: '',
        id: 0,
        attributes: {
          'DOUBLE_OPT-IN': '',
          NAME: '',
          WALLET_ADDRESS: '',
        },
        createdAt: '',
        emailBlacklisted: false,
        listIds: [],
        modifiedAt: '',
        smsBlacklisted: false,
      });
    }
  }, [walletAddress, mailApiKey, mailSrv]);

  useEffect(() => {
    if (foundUser.email) {
      state.name = foundUser.attributes.NAME;
      state.email = foundUser.email;
    }
  });

  return (
    <div className="mt-5">
      <div className="w-100 sovryn-border p-3 mt-2">
        {!foundUser.email && response !== 'success' && walletAddress && (
          <NotificationFormComponent
            name={name}
            email={email}
            marketing={state.marketing}
            response={response}
            onSubmit={addUser}
            onChange={onChange}
            formType="signup"
          />
        )}

        {showUpdateForm && (
          <NotificationFormComponent
            name={name}
            email={email}
            marketing={state.marketing}
            response={response}
            onSubmit={updateUser}
            onChange={onChange}
            formType="update"
          />
        )}

        {response === 'success' && (
          <div>
            Check your inbox for an email from us, click the link, and you will
            be signed up for email notifications!
          </div>
        )}

        {foundUser.email && !showUpdateForm && (
          <p>
            You are currently signed up for email notifications about margin
            calls at {foundUser.email}.
            <span onClick={() => setShowUpdateForm(true)}>
              Update settings.
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
