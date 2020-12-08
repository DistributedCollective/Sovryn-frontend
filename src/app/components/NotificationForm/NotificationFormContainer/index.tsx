/**
 *
 * NotificationForm
 *
 */

import React, { useReducer, useState, useEffect } from 'react';
import axios from 'axios';
import { useAccount } from '../../../hooks/useAccount';
import { NotificationFormComponent } from '../NotificationFormComponent';
import { EmailNotificationButton } from '../EmailNotificationButton';
import { CustomDialog } from '../../CustomDialog';
import { Sovryn } from '../../../../utils/sovryn';

export function NotificationForm() {
  const mailSrv = process.env.REACT_APP_MAIL_SRV;

  const walletAddress = useAccount();
  const emptyUser = {
    user_address: '',
    email: '',
    name: '',
    first_transaction: '',
    marketing: true,
    notifications: true,
    referred_by: '',
  };

  const [response, setResponse] = useState('');
  const [foundUser, setFoundUser] = useState(emptyUser);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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

  //SET VALUES IN UPDATE FORM
  useEffect(() => {
    if (foundUser.email && foundUser.name) {
      dispatch({ field: 'name', value: foundUser.name });
      dispatch({ field: 'email', value: foundUser.email });
      dispatch({ field: 'marketing', value: foundUser.marketing });
    }
  }, [foundUser]);

  //UPDATE OR ADD USER
  const addUser = e => {
    e.preventDefault();
    setResponse('pending');

    const timestamp = new Date();

    const newUser = {
      name: state.name,
      email: state.email,
      walletAddress: walletAddress,
      marketing: state.marketing,
      notifications: true,
    };

    const message = `${timestamp} \n \n Please confirm that the details associated with this account will now be: \n \n Username: ${name} \n Email: ${email}`;

    Sovryn.getWriteWeb3()
      .eth.personal.sign(message, walletAddress, '')
      .then(res =>
        axios
          .post(mailSrv + 'updateUser', {
            ...newUser,
            signedMessage: res,
            message: message,
          })
          .then(res => {
            setResponse('success');
            console.log(res.data);
          })
          .catch(e => {
            setResponse('error');
            console.log(e);
          }),
      );
  };

  //GET USER
  useEffect(() => {
    setLoading(true);
    if (walletAddress) {
      axios
        .post(mailSrv + 'getUser', {
          walletAddress: walletAddress,
        })
        .then(res => {
          setFoundUser(res.data);
          setLoading(false);
        })
        .catch(e => {
          console.log(e);
          setLoading(false);
        });
    } else {
      setFoundUser({
        user_address: '',
        email: '',
        name: '',
        first_transaction: '',
        marketing: true,
        notifications: true,
        referred_by: '',
      });
      setLoading(false);
    }
  }, [walletAddress, mailSrv]);

  return (
    <>
      <div className={`d-none ${!loading && walletAddress && 'd-inline'}`}>
        <EmailNotificationButton
          text={`${
            foundUser.email
              ? 'Update email settings'
              : 'Get email notifications'
          }`}
          onClick={() => setShowForm(true)}
        />
      </div>
      <CustomDialog
        show={showForm}
        title="Email Notifications"
        onClose={() => setShowForm(false)}
        content={
          <div>
            {loading || response === 'pending' ? (
              <div className="bp3-skeleton">&nbsp;</div>
            ) : (
              <div>
                {response !== 'success' && (
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

                {/* {foundUser.email && response !== 'success' && (
                  <NotificationFormComponent
                    name={name}
                    email={email}
                    marketing={state.marketing}
                    response={response}
                    onSubmit={updateUser}
                    onChange={onChange}
                    formType="update"
                  />
                )} */}

                {response === 'success' && !foundUser.email && (
                  <div>
                    Check your inbox for an email from us, click the link, and
                    you will be signed up for email notifications!
                  </div>
                )}

                {response === 'success' && foundUser.email && (
                  <div>Your details have been updated.</div>
                )}
              </div>
            )}
          </div>
        }
      />
    </>
  );
}
