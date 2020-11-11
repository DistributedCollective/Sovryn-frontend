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

  const walletAddress = useAccount();
  const emptyUser = {
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
  };

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [response, setResponse] = useState('');
  const [foundUser, setFoundUser] = useState(emptyUser);
  const [loading, setLoading] = useState(true);

  //Reducer for updating state on form change
  function reducer(state, { field, value }) {
    return {
      ...state,
      [field]: value,
    };
  }
  const initialState = {
    name: '',
    email: '',
    marketing: true,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { name, email } = state;

  //Handle form change
  const onChange = e => {
    if (e.target.type === 'checkbox') {
      dispatch({ field: e.target.name, value: !state[e.target.name] });
    } else {
      dispatch({ field: e.target.name, value: e.target.value });
    }
  };

  //ADD USER
  const addUser = e => {
    e.preventDefault();
    const newUser = {
      name: state.name,
      email: state.email,
      walletAddress: walletAddress,
      doubleOptIn: false,
      preferences: {
        marketing: state.marketing,
        notifications: true,
      },
    };
    axios
      .post(mailSrv + 'addUser', newUser, {
        headers: {
          Authorization: mailApiKey,
        },
      })
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

  //SHOW UPDATE FORM
  const updateForm = () => {
    dispatch({ field: 'name', value: foundUser.attributes.NAME });
    dispatch({ field: 'email', value: foundUser.email });
    setShowUpdateForm(true);
  };

  //UPDATE USER
  const updateUser = e => {
    e.preventDefault();
    const updatedUser = {
      name: foundUser.attributes.NAME,
      newName: name !== foundUser.attributes.NAME ? name : null,
      email: foundUser.email,
      newEmail: email !== foundUser.email ? email : null,
      walletAddress: walletAddress,
    };
    console.log(updatedUser);
    axios
      .post(mailSrv + 'updateUser', updatedUser, {
        headers: {
          Authorization: mailApiKey,
        },
      })
      .then(res => {
        console.log('updated user');
        setResponse('success');
        console.log(res.data);
      })
      .catch(e => {
        console.log('Error updating user');
        console.log(e);
      });
  };

  //GET USER
  useEffect(() => {
    setLoading(true);
    setShowUpdateForm(false);
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
          setLoading(false);
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
      setLoading(false);
    }
  }, [walletAddress, mailApiKey, mailSrv]);

  return (
    <div className="mt-5">
      {loading ? (
        <div className="bp3-skeleton">&nbsp;</div>
      ) : (
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

          {showUpdateForm && response !== 'success' && (
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

          {response === 'success' && !foundUser.email && (
            <div>
              Check your inbox for an email from us, click the link, and you
              will be signed up for email notifications!
            </div>
          )}

          {response === 'success' && foundUser.email && (
            <div>Your details have been updated.</div>
          )}

          {foundUser.email && !showUpdateForm && (
            <p>
              You are currently signed up for email notifications about margin
              calls at {foundUser.email}.{' '}
              <span onClick={updateForm} className="font-weight-bold">
                Update settings.
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
